import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict
from models.user_request import BookReadersRequest, BookRecommendationRequest

def recommend_books_for_target_user(request: BookRecommendationRequest) -> Dict:
    target_user_id = request.target_user_id
    limit = request.limit

    # 책을 기준으로 사용자-책 매트릭스 생성
    book_data = {book.book_id: [1 if user in book.user_ids else 0 for user in {user for book in request.books for user in book.user_ids}]
                 for book in request.books}
    
    user_ids = list({user for book in request.books for user in book.user_ids})
    user_book_matrix = pd.DataFrame(book_data, index=user_ids)

    # 추천 대상 사용자가 매트릭스에 있는지 확인
    if target_user_id not in user_book_matrix.index:
        return {"error": "Target user not found"}

    # 추천 대상 사용자가 읽은 책 확인
    user_read_books = user_book_matrix.loc[target_user_id]
    if user_read_books.sum() == 0:
        # 사용자가 읽은 책이 없을 경우, 인기 책 추천
        popular_books = user_book_matrix.sum().sort_values(ascending=False).index.tolist()
        return {"recommended_books": popular_books[:limit] if limit else popular_books}
    else:
        # 사용자 간 유사도 계산
        user_similarity = cosine_similarity(user_book_matrix)
        similarity_df = pd.DataFrame(user_similarity, index=user_book_matrix.index, columns=user_book_matrix.index)

        # 유사도 기반으로 추천 도서 계산
        similar_users = similarity_df[target_user_id]
        weighted_scores = user_book_matrix.T.dot(similar_users)
        unread_books = user_read_books[user_read_books == 0].index
        recommended_books = weighted_scores.loc[unread_books].sort_values(ascending=False).index.tolist()

        # 부족한 추천 수를 인기 책으로 보충
        if limit:
            recommended_books = recommended_books[:limit]
            if len(recommended_books) < limit:
                popular_books = user_book_matrix.sum().sort_values(ascending=False).index.tolist()
                for book in popular_books:
                    if book not in recommended_books and len(recommended_books) < limit:
                        recommended_books.append(book)

        return {"recommended_books": recommended_books}
