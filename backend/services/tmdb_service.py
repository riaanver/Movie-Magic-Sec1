import httpx
import os
from dotenv import load_dotenv
from fastapi import HTTPException
load_dotenv()
TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")

headers = {
    "Authorization": f"Bearer {TMDB_TOKEN}",
    "accept": "application/json"
}

async def get_popular_movie(page: int = 1):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/movie/popular",
                headers=headers,
                params={"language": "en-US", "page": page}

            )
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"TMDB API error: {e}")
    except httpx.TimeoutException as e:
        raise HTTPException(status_code=504, detail=f"Request timeout: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to TMDB: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

async def get_search_movie(query: str, page: int = 1):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/search/movie",
                headers=headers,
                params={"language": "en-US",
                        "page": page,
                        "query": query}

            )
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"TMDB API error: {e}")
    except httpx.TimeoutException as e:
        raise HTTPException(status_code=504, detail=f"Request timeout: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to TMDB: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

async def get_upcoming_movie(page: int = 1):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/movie/upcoming",
                headers = headers,
                params={"language": "en-US",
                        "page": page}
            )
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"TMDB API error: {e}")
    except httpx.TimeoutException as e:
        raise HTTPException(status_code=504, detail=f"Request timeout: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to TMDB: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

async def get_similar_movie(movie_id: int, page: int = 1):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{TMDB_BASE_URL}/movie/{movie_id}/similar",
                    headers = headers,
                    params = {"language": "en-US",
                              "page": page}
                )
                response.raise_for_status()
                return response.json()

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"TMDB API error: {e}")
    except httpx.TimeoutException as e:
        raise HTTPException(status_code=504, detail=f"Request timeout: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to TMDB: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

async def get_recommendation_movie(movie_id: int, page: int = 1):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{TMDB_BASE_URL}/movie/{movie_id}/recommendations",
                    headers=headers,
                    params={"language": "en-US",
                            "page": page}
                )
                response.raise_for_status()
                return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"TMDB API error: {e}")
    except httpx.TimeoutException as e:
        raise HTTPException(status_code=504, detail=f"Request timeout: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to TMDB: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

async def get_actor_movie_credits(actor_id: int):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{TMDB_BASE_URL}/person/{actor_id}/movie_credits",
                    headers = headers,
                    params={"language": "en-US",
                            }
                )
                response.raise_for_status()
                return response.json()

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"TMDB API error: {e}" )
    except httpx.TimeoutException as e:
        raise HTTPException(status_code=504, detail=f"Request timeout: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to TMDB: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

async def get_movie_credit(movie_id: int):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{TMDB_BASE_URL}/movie/{movie_id}/credits",
                    headers=headers,
                    params={"language": "en-US"}
                )
                response.raise_for_status()
                return response.json()

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"TMDB API error: {e}")
    except httpx.TimeoutException as e:
        raise HTTPException(status_code=504, detail=f"Request timeout: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to TMDB: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
