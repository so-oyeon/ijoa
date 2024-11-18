import os
from confluent_kafka import Producer
import boto3
import json
import joblib
import torch
import torchaudio
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts
from io import BytesIO
from datetime import datetime

torch.cuda.empty_cache()


OUT_PATH = "/home/ssafy/ijoa/app/run/training"
DATA_PATH = "/home/ssafy/ijoa/app/dataset"

s3_client = boto3.client("s3")
bucket_name = "checkitout-bucket"

producer_conf = {
    'bootstrap.servers': '54.180.201.1:9092'
}
producer = Producer(producer_conf)

def process_tts(request_data):
    print("process_tts")
    pages = request_data['pages']
    model_path = request_data['model_path']
    tts_id = request_data['tts_id']
    book_id = request_data['book_id']

    # 경로 설정
    CONFIG_PATH = model_path +"config.json"  # config.json 파일 경로
    CHECKPOINT_PATH = os.path.join(model_path, "best_model.pth")  # 가장 최신 또는 최종 학습된 체크포인트 파일

    REFERENCE_AUDIO_PATH = os.path.join(DATA_PATH,str(tts_id),"wavs","audio1.wav")  # 화자 참조 오디오 파일 경로
    VOCAB_PATH =os.path.join(OUT_PATH, "XTTS_v2.0_original_model_files","vocab.json")


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
        current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
        # S3 업로드
        s3_key = f"audio/{tts_id}/{book_id}/{page_id}xtts_output_{current_time}.wav"
        s3_client.upload_fileobj(audio_buffer, bucket_name, s3_key)
        s3_keys.append({"tts_id":tts_id, "pageId": page_id, "s3_key": s3_key})

    # S3 경로를 Kafka로 전송
    result_message = {
        "ttsId": tts_id,
        "bookId": book_id,
        "s3Keys": s3_keys
    }
    producer.produce("tts_save_audio", json.dumps(result_message))
    producer.flush()

# if __name__ == "__main__":
#     # 예제 요청 데이터
#     request_data = {
#     	"book_id": 4,
#     	"tts_id": 9,
#     	"model_path": "/home/j-k11d105/ijoa/app/run/training/1/GPT_XTTS_v2.0-November-06-2024_04+36PM-0000000/",
#     	"pages": [
#     		{
#     			"pageId": 48,
#     			"text": "“싫어, 까만색 양말 신기 싫어! 레이스 달린 분홍 양말 신을래!” 아침부터 송이는 심술이 났어요. “레이스 달린 분홍 양말은 빨았어. 오늘만 까만색 양말 신고 가.” 엄마는 송이를 겨우 달래서 까만색 양말을 신겨 주었어요."
#     		},
#     		{
#     			"pageId": 49,
#     			"text": "유치원에 간 송이는 기분이 좋지 않았어요.나리의 분홍 레이스가 달린 양말이 부러웠거든요.‘나도 레이스 달린 분홍 양말 신고 싶은데.’송이는 시무룩한 얼굴로 친구들을 쳐다봤어요.그때 나리가 엄지손가락을 번쩍 치켜들었어요."
#     		},
#     		{
#     			"pageId": 50,
#     			"text": "“공주놀이 할 사람 여기 붙어라!”"
#     		},
#     		{
#     			"pageId": 51,
#     			"text": "“나도 공주놀이 할래.” 송이가 다가가자 나리가 고개를 절레절레 저었어요. “안 돼. 너는 바지 입고 까만색 양말 신었으니 공주 못 해!” “맞아, 공주는 까만색 양말 안 신어.” “흥! 나도 너희랑 안 놀아!”"
#     		},
#     		{
#     			"pageId": 52,
#     			"text": "그때 민호가 송이의 양말을 가리키며 놀렸어요. “송이는 남자 양말 신었대요.” “남자 양말 아니야! 이건 그냥 까만색 양말이야!” 송이는 힘껏 소리쳤지만, 이내 시무룩해졌어요."
#     		},
#     		{
#     			"pageId": 53,
#     			"text": "하루 종일 송이의 눈에는 양말만 보였어요.그중에서도 분홍 레이스가 달린 나리의 양말이 제일 눈에 띄었어요."
#     		},
#     		{
#     			"pageId": 54,
#     			"text": "집에 돌아온 송이는 엄마를 보자마자 울음을 터뜨렸어요. “으앙, 까만색 양말 싫어! 나도 레이스 달린 분홍 양말 신고 싶어.” 송이는 까만색 양말을 휙휙 벗어 던졌어요."
#     		},
#     		{
#     			"pageId": 55,
#     			"text": "송이 혼자 방에 있는데 갑자기 동생 용이가 송이를 불렀어요.“누나!짜잔!내 레드 파워를 받아라!”용이는 손에 빨간색 양말을 낀 아주 우스꽝스러운 모습을 하고 있었어요."
#     		},
#     		{
#     			"pageId": 56,
#     			"text": "그 빨간색 양말은 송이에게 작아서 용이에게 물려 준 양말이었어요.송이는 쿡 웃음이 났지만 꾹 참았어요."
#     		},
#     		{
#     			"pageId": 57,
#     			"text": "“누나, 나 멋있지?” “멋있긴 뭐가 멋있어! 여자 양말 손에 끼고서!” 송이는 버럭 화를 냈어요. 하지만 용이는 신나서 폴짝폴짝 뛰었어요. “이거 여자 양말 아니야. 난 이 양말이 맘에 쏙 드는데?"
#     		},
#     		{
#     			"pageId": 58,
#     			"text": "그날 저녁, 빨래를 널던 엄마가 말했어요.“이를 어째!송이의 레이스 달린 분홍 양말에 구멍이 크게 나 버렸네.송이야, 엄마가 내일 레이스 달린 분홍 양말 꼭 사다 줄 테니, 내일도 다른 양말 신고 가야겠다.”"
#     		},
#     		{
#     			"pageId": 59,
#     			"text": "송이는 너무 속상해서 눈물이 그렁그렁 맺혔어요."
#     		},
#     		{
#     			"pageId": 60,
#     			"text": "잠을 자려고 누워도 머릿속은 온통 양말 생각뿐이었어요.분홍색 양말, 까만색 양말, 레이스가 달린 양말.온갖 양말들이 머리 위에서 둥둥 떠다녔어요.그러다가 낮에 용이에게 화낸 일이 생각났어요."
#     		},
#     		{
#     			"pageId": 61,
#     			"text": "‘용이는 양말 색깔 같은 건 아무렇지도 않은가 봐.’"
#     		},
#     		{
#     			"pageId": 62,
#     			"text": "송이는 살그머니 용이 방으로 가 보았어요. 용이는 쿨쿨 잠을 자고 있었어요. 장난감 사이로 빨간색 양말이 보였어요. ‘용이 생각이 맞아, 여자 색깔, 남자 색깔이란 건 없어.”"
#     		},
#     		{
#     			"pageId": 63,
#     			"text": "다음 날 송이는 유치원에 가고 싶지 않았어요. 그때 엄마가 송이의 방으로 들어왔어요. 엄마는 레이스와 리본을 단 노란색 양말을 들고 있었어요."
#     		},
#     		{
#     			"pageId": 64,
#     			"text": "“송이야, 분홍색 아니어도 괜찮니?” “네, 분홍색이 아니어도 마음에 쏙 들어요.” 송이는 거울에 양말을 비춰 보며 쌩긋 웃었어요."
#     		},
#     		{
#     			"pageId": 65,
#     			"text": "유치원에 간 송이는 노란색 양말을 자랑했어요. 모두 송이의 양말을 보고 예쁘다고 했어요. 나리도 자기 분홍 양말보다 예쁘다며 부러워했어요. 송이는 아주아주 행복했어요."
#     		}
#     	]
# }
#     process_tts(request_data)
    
