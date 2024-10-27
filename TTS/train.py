from TTS.api import Trainer

# config.json 파일 경로와 모델 경로 지정
trainer = Trainer(config_path="/workspace/config.json", model_path="/app/tts_models/ko/kss/xtts")

# 훈련 시작
trainer.train()
