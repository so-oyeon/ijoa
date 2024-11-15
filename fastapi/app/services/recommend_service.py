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

    # 책을 기준으로 사용자-책 매트릭스 생성
    book_data = {
        book.book_id: [1 if user in book.user_ids else 0 for user in {user for book in request.books for user in book.user_ids}]
        for book in request.books
    }
    user_ids = list({user for book in request.books for user in book.user_ids})
    user_book_matrix = pd.DataFrame(book_data, index=user_ids)

    # 대상 사용자가 매트릭스에 없을 경우
    if target_user_id not in user_book_matrix.index:
        # 인기 책 추천 (읽지 않은 책만 포함)
        popular_books = user_book_matrix.sum().sort_values(ascending=False).index.tolist()
        unread_books = [book for book in popular_books if target_user_id not in user_book_matrix.index or user_book_matrix.loc[target_user_id, book] == 0]
        return {"recommended_books": unread_books[:RECOMMEND_LIMIT]}

    # 추천 대상 사용자가 읽은 책 확인
    user_read_books = user_book_matrix.loc[target_user_id]
    already_read_books = user_read_books[user_read_books > 0].index  # 이미 읽은 책
    unread_books = user_read_books[user_read_books == 0].index  # 읽지 않은 책

    # 사용자가 읽은 책이 없을 경우, 인기 책 추천 (읽지 않은 책만 포함)
    if len(already_read_books) == 0:
        popular_books = user_book_matrix.sum().sort_values(ascending=False).index.tolist()
        unread_books = [book for book in popular_books if book not in already_read_books]
        return {"recommended_books": unread_books[:RECOMMEND_LIMIT]}

    # 사용자 간 유사도 계산
    user_similarity = cosine_similarity(user_book_matrix)
    similarity_df = pd.DataFrame(user_similarity, index=user_book_matrix.index, columns=user_book_matrix.index)

    # 유사도 기반으로 추천 도서 계산
    similar_users = similarity_df[target_user_id]
    weighted_scores = user_book_matrix.T.dot(similar_users)

    # 읽지 않은 책만 필터링
    filtered_books = weighted_scores.loc[unread_books].sort_values(ascending=False).index.tolist()

    # 부족한 추천 수를 인기 책으로 보충 (읽지 않은 책만 포함)
    recommended_books = filtered_books[:RECOMMEND_LIMIT]
    if len(recommended_books) < RECOMMEND_LIMIT:
        popular_books = user_book_matrix.sum().sort_values(ascending=False).index.tolist()
        for book in popular_books:
            if book not in recommended_books and len(recommended_books) < RECOMMEND_LIMIT:
                recommended_books.append(book)

    return {"recommended_books": recommended_books}