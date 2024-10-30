import os
from TTS.api import TTS


tts = TTS("/app/xtts_models",gpu=False)

# generate speech by cloning a voice using default settings
tts.tts_to_file(text="우주 고양이 아주 잘 만든 거 볼 수 있죠?",
                file_path=os.path.join(os.getenv("OUTPUT_PATH"), "output.wav"),
                speaker_wav=["/app/dataset/wavs/audio1.wav"],
                language="ko",
                split_sentences=True
                )