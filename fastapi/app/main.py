from fastapi import FastAPI, HTTPException
from models.user_request import BookRecommendationRequest
from services.recommend_service import recommend_books_for_target_user

app = FastAPI()

@app.post("/recommend_books/")
def get_recommendations(request: BookRecommendationRequest):
    result = recommend_books_for_target_user(request)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result