from fastapi import FastAPI
from confluent_kafka import Consumer, Producer
import json
import threading
import tts_processor

app = FastAPI()

# Kafka 설정
consumer_conf = {
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'tts_group',
    'auto.offset.reset': 'earliest'
}
consumer = Consumer(consumer_conf)

def consume_messages():
    consumer.subscribe(['tts_create_audio'])
    
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print("Consumer error: {}".format(msg.error()))
            continue
        
         # 메시지 수신
        request_data = json.loads(msg.value().decode('utf-8'))
        
        # TTS 처리 함수 호출
        tts_processor.process_tts(request_data)

# FastAPI 서버와 별도로 Kafka 컨슈머 스레드 실행
threading.Thread(target=consume_messages, daemon=True).start()