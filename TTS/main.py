from fastapi import FastAPI
from confluent_kafka import Consumer, Producer
import json
import threading
import tts_processor as tts_processor
import create_tts as create_tts
import test_create_tts as test_create_tts
import test_processor as test_processor
import asyncio
from concurrent.futures import ThreadPoolExecutor

app = FastAPI()

# Kafka 설정
consumer_conf = {
    'bootstrap.servers': 'k11d105.p.ssafy.io:9092',
    'group.id': 'tts_group',
    'auto.offset.reset': 'earliest'
}
consumer = Consumer(consumer_conf)

executor = ThreadPoolExecutor()

def send_error_to_kafka(tts_id, error_message):
    # Kafka로 보낼 메시지 생성
    message = {
        "ttsId": tts_id,
        "errorMassage": error_message
    }
    
    # 메시지를 Kafka 토픽으로 전송
    topic = "tts_error"  # 원하는 Kafka 토픽 이름
    producer.produce(topic, json.dumps(message))
    producer.flush()
    print(f"Kafka로 error message 전송 완료")  


async def process_tts_async(request_data):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(executor, tts_processor.process_tts, request_data)

async def train_tts_model_async(request_data):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(executor, create_tts.train_tts_model, request_data)


async def consume_messages():
    consumer.subscribe(['tts_create_audio', 'create_tts'])
    
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            await asyncio.sleep(0.1)
            continue
        if msg.error():
            print("Consumer error: {}".format(msg.error()))
            continue
        
         # 메시지 수신
        topic = msg.topic()
        request_data = json.loads(msg.value().decode('utf-8'))

        # 토픽에 따라 다른 함수 호출
        if topic == 'tts_create_audio':
            asyncio.create_task(process_tts_async(request_data))
            # test_processor.process_tts(request_data)

        elif topic == 'create_tts':
            try:
                asyncio.create_task(train_tts_model_async(request_data))
                # test_create_tts.train_tts_model(request_data)
            except Exception as e:
                error_message = f"모델 학습 중 오류 발생: {str(e)}"
                print(error_message)
                send_error_to_kafka(tts_id, error_message)
            


# # FastAPI 서버와 별도로 Kafka 컨슈머 스레드 실행
# threading.Thread(target=consume_messages, daemon=True).start()

@app.on_event("startup")
async def startup_event():
    # consume_messages를 비동기로 실행
    asyncio.create_task(consume_messages())
