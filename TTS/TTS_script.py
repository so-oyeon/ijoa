from TTS.api import TTS
tts = TTS("/app/xtts_model",gpu=False)

# generate speech by cloning a voice using default settings
tts.tts_to_file(text="우주 고양이 아주 잘 만든 거 볼 수 있죠?",
                file_path="/workspace/output/output.wav",
                speaker_wav=["/workspace/dataset/wavs/audio1.wav"],
                language="ko",
                split_sentences=True
                )