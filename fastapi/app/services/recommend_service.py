import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict
from models.user_request import BookRecommendationRequest
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

    # 대상 사용자가 매트릭스에 없을 경우
    if target_user_id not in user_book_matrix.index:
        unread_books = [book for book in popular_books if user_book_matrix[book].sum() == 0]
        return {"recommended_books": unread_books[:RECOMMEND_LIMIT]}

    # 추천 대상 사용자의 읽지 않은 책 확인
    user_read_books = user_book_matrix.loc[target_user_id]
    unread_books = user_read_books[user_read_books == 0].index

    # 사용자가 읽은 책이 없을 경우
    if unread_books.empty:
        return {"recommended_books": [book for book in popular_books if book not in user_read_books][:RECOMMEND_LIMIT]}

    # 사용자 간 유사도 계산 및 추천
    user_similarity = cosine_similarity(user_book_matrix)
    similar_users = user_similarity[user_book_matrix.index.get_loc(target_user_id)]
    weighted_scores = user_book_matrix.T.dot(similar_users)

    # 읽지 않은 책만 필터링
    recommended_books = weighted_scores.loc[unread_books].sort_values(ascending=False).index.tolist()[:RECOMMEND_LIMIT]

    # 부족한 추천 수를 인기 책으로 보충
    for book in popular_books:
        if len(recommended_books) >= RECOMMEND_LIMIT:
            break
        if book not in recommended_books and book in unread_books:
            recommended_books.append(book)

    return {"recommended_books": recommended_books}
