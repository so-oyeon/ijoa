from confluent_kafka import Producer
import boto3
import json
import joblib
import os
import torch
import torchaudio
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts
from io import BytesIO

os.environ["CUDA_VISIBLE_DEVICES"] = "1"

s3_client = boto3.client("s3")
bucket_name = "checkitout-bucket"

# kafka
# producer_conf = {
#     'bootstrap.servers': 'k11d105.p.ssafy.io:9092'
# }
# producer = Producer(producer_conf)

def process_tts(request_data):
    pages = request_data['pages']
    model_path = request_data['model_path']
    tts_id = request_data['tts_id']
    book_id = request_data['book_id']

    # 경로 설정
    CONFIG_PATH = model_path +"config.json"  # config.json 파일 경로
    CHECKPOINT_PATH = os.path.join(model_path, "best_model.pth")  # 가장 최신 또는 최종 학습된 체크포인트 파일

    REFERENCE_AUDIO_PATH = f"/home/j-k11d105/ijoa/app/data/{tts_id}/wavs/audio1.wav"  # 화자 참조 오디오 파일 경로
    VOCAB_PATH ="/home/j-k11d105/ijoa/app/run/training/XTTS_v2.0_original_model_files/vocab.json"


    config = XttsConfig()
    config.load_json(CONFIG_PATH)  # config.json 파일 로드
    model = Xtts.init_from_config(config)  # 설정을 사용해 모델 초기화
    model.load_checkpoint(config, checkpoint_path=CHECKPOINT_PATH, vocab_path=VOCAB_PATH, use_deepspeed=False)  # 학습된 체크포인트 로드
    model.cuda()

    # 화자 임베딩 및 조건 생성
    print("Computing speaker latents...")
    gpt_cond_latent, speaker_embedding = model.get_conditioning_latents(audio_path=[REFERENCE_AUDIO_PATH])

    s3_keys =[]

    for page in pages:
        page_id = page['pageId']
        text = page['text']
        # 텍스트를 음성으로 변환
        print(f"Inference{page_id}")
        out = model.inference(
            text=text,
            language="ko",  # 사용할 언어 설정
            gpt_cond_latent=gpt_cond_latent,
            speaker_embedding=speaker_embedding,
            temperature=0.7  # 사용자 설정 파라미터
        )
        
        # 결과 저장
        audio_buffer = BytesIO()
        torchaudio.save(audio_buffer, torch.tensor(out["wav"]).unsqueeze(0), 24000, format="wav")
        audio_buffer.seek(0) 

        # S3 업로드
        s3_key = f"audio/{tts_id}/{book_id}/xtts_output_{page_id}.wav"
        s3_client.upload_fileobj(audio_buffer, bucket_name, s3_key)
        s3_keys.append({"tts_id":tts_id, "pageId": page_id, "s3_key": s3_key})

    # S3 경로를 Kafka로 전송
    # result_message = {
    #     "tts_id": tts_id,
    #     "book_id": book_id,
    #     "s3_keys": s3_keys
    # }
    # producer.produce("tts_save_audio", json.dumps(result_message))
    # producer.flush()

if __name__ == "__main__":
    # 예제 요청 데이터
    request_data = {
    	"book_id": 1,
    	"tts_id": 1,
    	"model_path": "/home/j-k11d105/ijoa/app/run/training/1/GPT_XTTS_v2.0-November-05-2024_12+03AM-0000000/",
    	"pages": [
    		{
    			"pageId": 1,
    			"text": "“멍청이 장난감들이 어디로 간 거지?” 노마가 뒤죽박죽 방 안을 둘러보며 소리쳤어요. “바보들아, 어디 숨어 있는 거야? 어서 나오지 못해! 쳇, 로켓을 타고 찾아봐야겠군.”"
    		},
    		{
    			"pageId": 2,
    			"text": "노마가 장난감 친구들을 찾아 나섰어요. 로켓을 타고 우주로 슈웅! 노마는 망원경으로 여기저기 살펴보았어요."
    		},
    		{
    			"pageId": 3,
    			"text": "곰돌이가 별님 자전거를 타고 따르릉따르릉. “야, 뚱보 곰! 너 거기서 뭐 하니?” 노마가 웃으며 손을 흔들었어요. 하지만 곰돌이는 흥, 콧방귀를 뀌었지요."
    		},
    		{
    			"pageId": 4,
    			"text": "“나더러 뚱보라고? 미운 말만 하는 너하고는 안 놀아.” “뭐라고? 나도 뚱보 너랑 안 놀아.”"
    		},
    		{
    			"pageId": 5,
    			"text": "노마가 로켓을 타고 슈웅! 쿵덕쿵덕 떡방아 찧는 토끼들을 보았어요. “못난이 토끼들아! 한참 찾았잖아.” 노마가 반갑다고 손을 흔들었어요."
    		},
    		{
    			"pageId": 6,
    			"text": "“우리더러 못난이라고? 미운 말만 하는 너하고는 안 놀아.” “치, 나도 못난이들하고는 안 놀아.”"
    		},
    		{
    			"pageId": 7,
    			"text": "노마가 로켓을 타고 슈웅! 은하수에서 헤엄치는 펭귄들을 보았어요. “바보 펭귄들아! 너희들 여기 있었구나.” 노마가 웃으며 손을 흔들었어요."
    		},
    		{
    			"pageId": 8,
    			"text": "하지만 펭귄들은 노마를 본척만척. “미운 말만 하는 너하고는 안 놀아.” “치, 멍청한 장난감들! 아빠한테 더 멋진 장난감을 사 달라고 할 테다.”"
    		},
    		{
    			"pageId": 9,
    			"text": "그때, 위잉위잉 이상한 우주선이 다가왔어요. “어? 왜 입이 간질간질하지?” 노마의 입이 어느새 문어처럼 변해 버렸어요."
    		},
    		{
    			"pageId": 10,
    			"text": "문어 입 우주인이 말했어요. “바보 노마, 안녕? 우리와 함께 가자. 뿌까뽀까.” “왜 나를 데려가겠다는 거야?” “너처럼 미운 말만 하는 아이는 문어 입 우주인이 틀림없어!”"
    		},
    		{
    			"pageId": 11,
    			"text": "“싫어! 아니야!” “문어 입 우주인은 문어 별에서 사는 거야.” “미운 말, 나쁜 말만 하면서 말이지. 하하하.” 우주선의 문어 발이 노마의 로켓을 꽉 잡았어요."
    		},
    		{
    			"pageId": 12,
    			"text": "“노마야, 우리가 도와줄게.” 장난감 친구들이 영차,영차. 문어 발을 떼어 내기 시작했어요. 겁을 먹은 문어 입 우주인은 쌩 달아났어요."
    		},
    		{
    			"pageId": 13,
    			"text": "“얘들아, 고마워!내가 나쁜 말, 미운 말 했던 거 미안해.”노마가 쭉 나온 문어 입으로 장난감 친구들에게 사과했어요.“그럼 이제부터 예쁜 말만 하는 거다!자, 어서 집으로 가서 재미있게 놀자.”모두 함께 로켓을 타고 슈웅!"
    		},
    		{
    			"pageId": 14,
    			"text": "풀썩! 노마와 장난감 친구들이 집으로 돌아왔어요. 노마의 문어 입도 예쁜 입으로 돌아왔어요. 이제 노마가 문어 별에 갈 일은 없겠지요?"
    		}
    	]
    }
    process_tts(request_data)
    
