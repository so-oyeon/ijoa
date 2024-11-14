from pydantic import BaseModel
from typing import List

class BookReadersRequest(BaseModel):
    book_id: int
    user_ids: List[int]

class BookRecommendationRequest(BaseModel):
    target_user_id: int
    books: List[BookReadersRequest]