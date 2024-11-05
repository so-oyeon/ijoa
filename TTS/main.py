from fastapi import FastAPI
from confluent_kafka import Consumer, Producer
import json
import threading
import tts_processor

app = FastAPI()

# Kafka 설정
consumer_conf = {
    'bootstrap.servers': 'k11d105.p.ssafy.io:9092',
    'group.id': 'tts_group',
    'auto.offset.reset': 'earliest'
}
consumer = Consumer(consumer_conf)

def consume_messages():
    consumer.subscribe(['tts_create_audio', 'create_tts'])
    
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print("Consumer error: {}".format(msg.error()))
            continue
        
         # 메시지 수신
        topic = msg.topic()
        request_data = json.loads(msg.value().decode('utf-8'))

        # 토픽에 따라 다른 함수 호출
        if topic == 'tts_create_audio':
            tts_processor.process_tts(request_data)
        elif topic == 'create_tts':
            # request_data = {
            #     "tts_id": 1,
            # 	"path": [
            #     		"train/1/9f4b4256-c041-41d2-bd8a-6276b42d5f25/audio1.wav",
            #     		"train/1/9400403c-7f0f-4248-830d-babea8fbd524/audio2.wav",
            #         	"train/1/3b61df6a-79c5-422e-aca2-973d8d2c2066/audio3.wav"
            #         	],
            # 	"script": [
            #     		"우주 고양이 아주 잘 만든 거 볼 수 있죠?",
            #     		"제가 얼마 전에 써봤을 때보다 성능이 굉장히 좋아진 것 같은데요?",
            #         	"이렇게 되게 말끔하게 나왔습니다"
            # 	]
            # }
            create_tts.train_tts_model(request_data)

# FastAPI 서버와 별도로 Kafka 컨슈머 스레드 실행
threading.Thread(target=consume_messages, daemon=True).start()