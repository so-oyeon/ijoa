from fastapi import FastAPI
from contextlib import asynccontextmanager
from services.database import connect_to_db, close_db_connection
from services.book_service import get_books_and_readers
from services.recommend_service import recommend_books_for_target_user
from models.user_request import BookRecommendationRequest
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_db(app)  # 데이터베이스 연결
    yield
    await close_db_connection(app)  # 데이터베이스 연결 종료

app = FastAPI(
    lifespan=lifespan,  # Lifespan 추가
    # root_path="/fastapi",
    docs_url="/docs",
    openapi_url="/openapi.json"
)



@app.post("/recommend")
async def recommend_books(child_id: int):
    try:
        # 책별 사용자 데이터 가져오기
        books = await get_books_and_readers(app)

        # 추천 요청 객체 생성
        recommendation_request = BookRecommendationRequest(
            target_user_id=child_id,  # child_id를 target_user_id로 설정
            books=books
        )

        # 추천 로직 실행
        result = recommend_books_for_target_user(recommendation_request)

        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))