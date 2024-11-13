from pydantic import BaseModel
from typing import List, Optional

class BookReadersRequest(BaseModel):
    book_id: int
    user_ids: List[int]

class BookRecommendationRequest(BaseModel):
    target_user_id: int
    limit: Optional[int] = None
    books: List[BookReadersRequest]
    