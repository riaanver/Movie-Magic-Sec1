from fastapi import FastAPI
from models import ChatMessage
from services.tmdb_service import get_popular_movie, get_search_movie, get_upcoming_movie, get_similar_movie, get_recommendation_movie

app = FastAPI()

@app.post("/message")
def chat(messages: ChatMessage):
    return {"user_said": messages.message,
            "bot_response": "Got it!"}

@app.get("/movies/popular")
async def popular_movie(page: int = 1):
    result = await get_popular_movie(page)
    return result

@app.get("/search/movie")
async def search_movie(query: str, page: int = 1):
    result = await get_search_movie(query, page)
    return result

@app.get("/movie/upcoming")
async def upcoming_movie(page: int = 1):
    result = await get_upcoming_movie(page)
    return result

@app.get("/movie/{movie_id}/similar")
async def similar_movie(movie_id: int, page: int = 1):
    result = await get_similar_movie(movie_id, page)
    return result

@app.get("/movie/{movie_id}/recommendations")
async def recommendation_movie(movie_id: int, page: int = 1):
    result = await get_recommendation_movie(movie_id, page)
    return result




