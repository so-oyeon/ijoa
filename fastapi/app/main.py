from fastapi import FastAPI
from contextlib import asynccontextmanager
from services.database import connect_to_db, close_db_connection
from services.book_service import get_books_and_readers
from services.recommend_service import recommend_books_for_target_user
from models.user_request import BookRecommendationRequest
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_db(app)
    yield
    await close_db_connection(app)

app = FastAPI(
    lifespan=lifespan,
    root_path="/fastapi",
    docs_url="/docs",
    openapi_url="/openapi.json"
)



@app.post("/recommend")
async def recommend_books(childId: int):
    try:
        
        books = await get_books_and_readers(app)

        
        recommendation_request = BookRecommendationRequest(
            target_user_id=childId,
            books=books
        )

        
        result = recommend_books_for_target_user(recommendation_request)

        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
