from TTS.api import TTS

# 훈련된 모델 불러오기
tts = TTS(model_path="/workspace/trained_model.pth", config_path="/workspace/config.json")

# 텍스트를 음성으로 변환하여 저장
tts.tts_to_file(text="안녕하세요, 개인화된 한국어 모델입니다.", file_path="/workspace/output.wav")
