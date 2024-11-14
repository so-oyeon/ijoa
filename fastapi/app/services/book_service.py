from typing import List
from models.user_request import BookReadersRequest
from fastapi import FastAPI

async def get_books_and_readers(app: FastAPI) -> List[BookReadersRequest]:
    query = """
    SELECT fairytale_id, GROUP_CONCAT(child_id) AS user_ids
    FROM child_read_books
    GROUP BY fairytale_id
    """
    async with app.state.db_pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute(query)
            rows = await cur.fetchall()

    return [
        BookReadersRequest(book_id=row[0], user_ids=list(map(int, row[1].split(','))))
        for row in rows
    ]
