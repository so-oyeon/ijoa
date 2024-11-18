import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict
from ..models.user_request import BookRecommendationRequest
from dotenv import load_dotenv
import os

load_dotenv()
RECOMMEND_LIMIT = int(os.getenv("RECOMMEND_LIMIT"))

def recommend_books_for_target_user(request: BookRecommendationRequest) -> Dict:
    target_user_id = request.target_user_id

    # 사용자 ID와 책-사용자 매트릭스 생성
    user_ids = {user for book in request.books for user in book.user_ids}
    book_data = {
        book.book_id: [1 if user in book.user_ids else 0 for user in user_ids]
        for book in request.books
    }
    user_book_matrix = pd.DataFrame(book_data, index=list(user_ids))

    # 인기 책 리스트
    popular_books = user_book_matrix.sum().sort_values(ascending=False).index.tolist()

    # 읽지 않은 책 계산
    def calculate_unread_books(target_user_id):
        if target_user_id not in user_book_matrix.index:
            return [book for book in popular_books if book not in user_book_matrix.columns]
        user_read_books = user_book_matrix.loc[target_user_id]
        return [book for book in user_book_matrix.columns if user_read_books.get(book, 0) == 0]

    unread_books = calculate_unread_books(target_user_id)

    # 추천 대상 사용자가 매트릭스에 없거나 읽지 않은 책이 없는 경우
    if not unread_books:
        return {"recommended_books": popular_books[:RECOMMEND_LIMIT]}

    # 사용자 간 유사도 계산 및 추천
    user_similarity = cosine_similarity(user_book_matrix)
    similar_users = user_similarity[user_book_matrix.index.get_loc(target_user_id)]
    weighted_scores = user_book_matrix.T.dot(similar_users)

    # 읽지 않은 책만 필터링
    recommended_books = [book for book in weighted_scores.loc[unread_books].sort_values(ascending=False).index][:RECOMMEND_LIMIT]

    # 부족한 추천 수를 인기 책으로 보충
    for book in popular_books:
        if len(recommended_books) >= RECOMMEND_LIMIT:
            break
        if book not in recommended_books and book in unread_books:
            recommended_books.append(book)

    return {"recommended_books": recommended_books}