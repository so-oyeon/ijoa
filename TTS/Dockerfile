# Python 기반 이미지 선택
FROM python:3.9

# 작업 디렉터리 설정
WORKDIR /app

RUN pip install --upgrade pip

# 필수 패키지 설치
RUN apt-get update && apt-get install -y libsndfile1

# Coqui TTS 설치
RUN pip install TTS==0.22.0 

# 모델 및 경로 환경 변수 설정
ENV MODEL_PATH=/app/tts_models/ko/kss/xtts
ENV OUTPUT_PATH=/app/output

# 한국어 모델 다운로드 (한국어 xTTS 모델 사용)
RUN python3 -m TTS.utils.manage download_model tts_models/ko/kss/xtts
# 모델 미리 다운로드
RUN python3 -m TTS.utils.manage download_model tts_models/multilingual/multi-dataset/xtts_v2 -o /app/xtts_model


# Python 스크립트를 작업 디렉터리에 복사
COPY TTS_script.py /app/TTS_script.py

# 명령어 설정 (기본 설정, 필요에 따라 변경 가능)
CMD ["python3", "TTS_script.py"]