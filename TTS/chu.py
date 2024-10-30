import os
import torch
import torchaudio
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts

os.environ["CUDA_VISIBLE_DEVICES"] = "1"

# 경로 설정
CONFIG_PATH = "/home/j-k11d105/ijoa/app/run/training/GPT_XTTS_v2.0-October-29-2024_02+49PM-0000000/config.json"  # config.json 파일 경로
CHECKPOINT_DIR = "/home/j-k11d105/ijoa/app/run/training/GPT_XTTS_v2.0-October-29-2024_02+49PM-0000000/"  # 학습된 모델 체크포인트가 있는 폴더
CHECKPOINT_PATH = os.path.join(CHECKPOINT_DIR, "best_model.pth")  # 가장 최신 또는 최종 학습된 체크포인트 파일

REFERENCE_AUDIO_PATH = "/home/j-k11d105/ijoa/app/dataset/wavs/audio2.wav"  # 화자 참조 오디오 파일 경로
VOCAB_PATH ="/home/j-k11d105/ijoa/app/run/training/XTTS_v2.0_original_model_files/vocab.json"

# 모델 설정 로드
print("Loading model...")
config = XttsConfig()
config.load_json(CONFIG_PATH)  # config.json 파일 로드
model = Xtts.init_from_config(config)  # 설정을 사용해 모델 초기화
model.load_checkpoint(config, checkpoint_path=CHECKPOINT_PATH, vocab_path=VOCAB_PATH, use_deepspeed=False)  # 학습된 체크포인트 로드
model.cuda()

# 화자 임베딩 및 조건 생성
print("Computing speaker latents...")
gpt_cond_latent, speaker_embedding = model.get_conditioning_latents(audio_path=[REFERENCE_AUDIO_PATH])

# 텍스트를 음성으로 변환
print("Inference...")
text = "정진규 바보. 안녕 돼지. 돼지는 꿀꿀꿀"
out = model.inference(
    text=text,
    language="ko",  # 사용할 언어 설정
    gpt_cond_latent=gpt_cond_latent,
    speaker_embedding=speaker_embedding,
    temperature=0.7  # 사용자 설정 파라미터
)

# 결과 저장
OUTPUT_PATH = "/home/j-k11d105/ijoa/app/run/output/xtts_output.wav"
torchaudio.save(OUTPUT_PATH, torch.tensor(out["wav"]).unsqueeze(0), 24000)
print(f"Generated audio saved at: {OUTPUT_PATH}")