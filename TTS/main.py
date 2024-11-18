from fastapi import FastAPI
from confluent_kafka import Consumer, Producer
import json
import threading
import tts_processor as tts_processor
import create_tts as create_tts

app = FastAPI()

# Kafka 설정
consumer_conf = {
    'bootstrap.servers': '54.180.201.1:9092',
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
            create_tts.train_tts_model(request_data)


# FastAPI 서버와 별도로 Kafka 컨슈머 스레드 실행
threading.Thread(target=consume_messages, daemon=True).start()
