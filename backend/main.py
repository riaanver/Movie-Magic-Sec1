from fastapi import FastAPI
from models import ChatMessage
from services.tmdb_service import (get_popular_movie, get_search_movie, get_upcoming_movie,
                                   get_similar_movie, get_recommendation_movie, get_actor_movie_credits, get_movie_credit, get_top_rated_movies, get_movie_details)

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

@app.get("/person/{actor_id}/movie_credits")
async def actor_credit(actor_id: int):
    result = await get_actor_movie_credits(actor_id)
    return result

@app.get("/movie/{movie_id}/credits")
async def movie_credit(movie_id: int):
    result = await get_movie_credit(movie_id)
    return result

@app.get("/api/movies/top_rated")
async def top_rated_movies(page: int = 1):
    result = await get_top_rated_movies(page)
    return result

@app.get("/api/movies/{movie_id}")
async def movie_details(movie_id: int):
    result = await get_movie_details(movie_id)
    return result

@app.get("/api/search/person")
async def search_person(query: str, page: int = 1):
    result = await search_by_person(query, page)
    return result

@app.get("/api/person/{person_id}")
async def person_details(person_id: int):
    result = await get_person_details(person_id)
    return result