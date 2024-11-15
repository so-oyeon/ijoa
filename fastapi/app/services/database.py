import aiomysql
from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "1234"),
    "db": os.getenv("DB_NAME", "ijoa"),
}

async def connect_to_db(app: FastAPI):
    app.state.db_pool = await aiomysql.create_pool(
        host=DATABASE_CONFIG["host"],
        port=DATABASE_CONFIG["port"],
        user=DATABASE_CONFIG["user"],
        password=DATABASE_CONFIG["password"],
        db=DATABASE_CONFIG["db"],
        minsize=1,
        maxsize=10,
        autocommit=True,
    )

async def close_db_connection(app: FastAPI):
    app.state.db_pool.close()
    await app.state.db_pool.wait_closed()
