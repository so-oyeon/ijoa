import os
import boto3
import torch
from io import BytesIO
from trainer import Trainer, TrainerArgs
from TTS.config.shared_configs import BaseDatasetConfig
from TTS.tts.datasets import load_tts_samples
from TTS.tts.layers.xtts.trainer.gpt_trainer import GPTArgs, GPTTrainer, GPTTrainerConfig, XttsAudioConfig
from confluent_kafka import Producer
import json
import subprocess

torch.cuda.empty_cache()
# S3 클라이언트 설정
s3_client = boto3.client("s3")
bucket_name = "checkitout-bucket"

# 학습 설정
RUN_NAME = "GPT_XTTS_v2.0"
PROJECT_NAME = "XTTS_trainer"

OUT_PATH = "/home/ssafy/ijoa/app/run/training"
DATA_PATH = "/home/ssafy/ijoa/app/dataset"

OPTIMIZER_WD_ONLY_ON_WEIGHTS = True
START_WITH_EVAL = True
BATCH_SIZE = 3
GRAD_ACUMM_STEPS = 10 #42

# 체크포인트 파일 경로
CHECKPOINTS_OUT_PATH = os.path.join(OUT_PATH, "XTTS_v2.0_original_model_files")
DVAE_CHECKPOINT = os.path.join(CHECKPOINTS_OUT_PATH, "dvae.pth")
MEL_NORM_FILE = os.path.join(CHECKPOINTS_OUT_PATH, "mel_stats.pth")
TOKENIZER_FILE = os.path.join(CHECKPOINTS_OUT_PATH, "vocab.json")
XTTS_CHECKPOINT = os.path.join(CHECKPOINTS_OUT_PATH, "model.pth")


# Kafka Producer 설정
kafka_conf = {
    'bootstrap.servers': 'k11d105.p.ssafy.io:9092'  # Kafka 서버 주소
}
producer = Producer(kafka_conf)

def get_latest_subfolder_path(folder_path):
    """
    지정된 폴더 내 가장 최신 하위 폴더의 경로를 반환.
    
    Args:
        folder_path (str): 상위 폴더 경로
    
    Returns:
        str: 가장 최신 하위 폴더의 경로
    """
    subfolders = [os.path.join(folder_path, d) for d in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, d))]
    latest_subfolder = max(subfolders, key=os.path.getmtime) if subfolders else None
    return latest_subfolder+"/"

def send_model_path_to_kafka(tts_id, model_path):
    print("send_model_path_to_kafka")
    """
    학습 완료 후 Kafka로 모델 경로를 전송하는 함수.
    
    Args:
        tts_id (str): 학습 모델 ID
        model_path (str): 저장된 모델의 최종 경로
    """
    # Kafka로 보낼 메시지 생성
    message = {
        "ttsId": tts_id,
        "modelPath": model_path
    }
    
    # 메시지를 Kafka 토픽으로 전송
    topic = "tts_model_path"  # 원하는 Kafka 토픽 이름
    producer.produce(topic, json.dumps(message))
    producer.flush()
    print(f"Kafka로 모델 경로 전송 완료: {model_path}")

def send_error_to_kafka(tts_id, error_message):
    # Kafka로 보낼 메시지 생성
    message = {
        "ttsId": tts_id,
        "errorMassage": error_message
    }
    
    # 메시지를 Kafka 토픽으로 전송
    topic = "tts_error"  # 원하는 Kafka 토픽 이름
    producer.produce(topic, json.dumps(message))
    producer.flush()
    print(f"Kafka로 error message 전송 완료")    

def download_from_s3(wav_paths,tts_id):
    print("download s3")
    local_wav_paths = []
    for wav_path in wav_paths:
        file_name = wav_path.split('/')[-1]
        # local_path = f"/home/j-k11d105/ijoa/app/data/{tts_id}/wavs/{file_name}"
        local_path = os.path.join(DATA_PATH,str(tts_id),"wavs",file_name)
                # 폴더가 없는 경우 생성
        local_dir = os.path.dirname(local_path)
        os.makedirs(local_dir, exist_ok=True)
        
        s3_client.download_file(bucket_name, wav_path, local_path)
        
        subprocess.run(["ffmpeg", "-i", local_path, "-ar", "44100", "-ac", "2", local_path, "-y"])
        
        local_wav_paths.append(local_path)
        
    return local_wav_paths

def train_tts_model(request_data):
    print("train_tts_model")
    # 요청 데이터에서 wav_paths와 scripts 추출
    tts_id = request_data["tts_id"]
    path = request_data["path"]
    OUTPUT_FOLDER =os.path.join(OUT_PATH,str(tts_id))

    try:

        # S3에서 Wav 파일 다운로드
        local_wav_paths = download_from_s3(path,tts_id)
    
        config_dataset = BaseDatasetConfig(
            formatter="ljspeech",
            dataset_name="dataset",
            # metadata 경로 바꿔야함 
            path=f"/home/ssafy/ijoa/app/dataset/{tts_id}",
            meta_file_train= "/home/ssafy/ijoa/app/dataset/metadata.txt",
            language="ko",
            )

        # Add here the configs of the datasets
        DATASETS_CONFIG_LIST = [config_dataset]

        file_name = path[1].split('/')[-1]
        # Training sentences generations
        SPEAKER_REFERENCE = [
            os.path.join(DATA_PATH,str(tts_id),"wavs","audio2.wav") # speaker reference to be used in training test sentences
        ]
    
        LANGUAGE = config_dataset.language
    

        # 모델 설정
        model_args = GPTArgs(
            max_conditioning_length=302300, # 12
            min_conditioning_length=66150,  # 3 secs
            debug_loading_failures=False,
            max_wav_length=255995, 
            max_text_length=200,
            mel_norm_file=MEL_NORM_FILE,
            dvae_checkpoint=DVAE_CHECKPOINT,
            xtts_checkpoint=XTTS_CHECKPOINT,  # checkpoint path of the model that you want to fine-tune
            tokenizer_file=TOKENIZER_FILE,
            gpt_num_audio_tokens=1026,
            gpt_start_audio_token=1024,
            gpt_stop_audio_token=1025,
            gpt_use_masking_gt_prompt_approach=True,
            gpt_use_perceiver_resampler=True,
        )
    
        audio_config = XttsAudioConfig(sample_rate=22050, dvae_sample_rate=22050, output_sample_rate=24000)

        config = GPTTrainerConfig(
            epochs=10,
            output_path=OUTPUT_FOLDER,
            model_args=model_args,
            run_name=RUN_NAME,
            project_name=PROJECT_NAME,
            run_description="""
                GPT XTTS training
                """,
            audio=audio_config,
            batch_size=BATCH_SIZE,
            batch_group_size=48,
            eval_batch_size=BATCH_SIZE,
            num_loader_workers=8,
            eval_split_max_size= 256,
            save_step=10000,
            save_n_checkpoints=1,
            save_checkpoints=True,
            # target_loss="loss",
            print_eval=False,
            # Optimizer values like tortoise, pytorch implementation with modifications to not apply WD to non-weight parameters.
            optimizer="AdamW",
            optimizer_wd_only_on_weights=OPTIMIZER_WD_ONLY_ON_WEIGHTS,
            optimizer_params={"betas": [0.9, 0.96], "eps": 1e-8, "weight_decay": 1e-2},
            lr=5e-06,  # learning rate
            lr_scheduler="StepLR",
            # it was adjusted accordly for the new step scheme
            lr_scheduler_params={"step_size": 50, "gamma": 0.5, "last_epoch": -1},
            test_sentences=[
                {
                    "text": "세상에서 가장 어려운 일은 사람이 사람의 마음을 얻는 일이야. 내가 좋아하는 사람이 나를 좋아해 주는 건 기적이야.",
                    "speaker_wav": SPEAKER_REFERENCE,
                    "language": LANGUAGE,
                },

            ],
        )
    
        # 모델 초기화 및 데이터셋 로드
        model = GPTTrainer.init_from_config(config)
        train_samples, eval_samples = load_tts_samples(
            DATASETS_CONFIG_LIST,
            eval_split=True,
            eval_split_max_size=config.eval_split_max_size,
            eval_split_size=0.1, ###########0.02, # config.eval_split_size,
        )
    except Exception as e:
        error_message = f"모델 학습 데이터 로딩 오류 발생: {str(e)}"
        print(error_message)
        send_error_to_kafka(tts_id, error_message)

    try:
        # 모델 학습
        trainer = Trainer(
            TrainerArgs(
                restore_path=None,  # xtts checkpoint is restored via xtts_checkpoint key so no need of restore it using Trainer restore_path parameter
                skip_train_epoch=False,
                start_with_eval=START_WITH_EVAL,
                grad_accum_steps=GRAD_ACUMM_STEPS,
            ),
            config,
            output_path=OUT_PATH,
            model=model,
            train_samples=train_samples,
            eval_samples=eval_samples,
        )

        trainer.fit()

        final_model_path = get_latest_subfolder_path(OUTPUT_FOLDER)
        # final_model_path = "/home/ssafy/ijoa/app/run/training/1/GPT_XTTS_v2.0-November-06-2024_04+36PM-0000000/"
        if final_model_path:
            send_model_path_to_kafka(tts_id, final_model_path)
        else:
            print("최신 모델 경로를 찾지 못했습니다.")
    
    except Exception as e:
        error_message = f"모델 학습 중 오류 발생: {str(e)}"
        print(error_message)
        send_error_to_kafka(tts_id, error_message)
    
