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

async def get_top_rated_movies(page: int = 1):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/movie/top_rated",
                headers=headers,
                params={"language": "en-US", "page": page},
            )
            response.raise_for_status()
            data = response.json()

        movies = [
            {
                "id": movie["id"],
                "title": movie["title"],
                "overview": movie["overview"],
                "rating": movie["vote_average"],
                "release_date": movie["release_date"],
                "poster": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
                if movie.get("poster_path")
                else None,
            }
            for movie in data.get("results", [])
        ]

        return {
            "page": data.get("page"),
            "total_pages": data.get("total_pages"),
            "total_results": data.get("total_results"),
            "movies": movies,
        }

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"TMDB API error: {e}")
    except httpx.TimeoutException as e:
        raise HTTPException(status_code=504, detail=f"Request timeout: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to TMDB: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

async def get_movie_details(movie_id: int):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/movie/{movie_id}",
                headers=headers,
                params={"language": "en-US"},
            )
            response.raise_for_status()
            details = response.json()

        return {
            "id": details.get("id"),
            "title": details.get("title"),
            "overview": details.get("overview"),
            "release_date": details.get("release_date"),
            "runtime": details.get("runtime"),
        }

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"TMDB API error: {e}")
    except httpx.TimeoutException as e:
        raise HTTPException(status_code=504, detail=f"Request timeout: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to TMDB: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

async def search_by_person(query: str, page: int = 1):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/search/person",
                headers=headers,
                params={"language": "en-US",
                        "page": page,
                        "query": query},
            )
            response.raise_for_status()
            details = response.json()

        actors = [
        {
            "id": person["id"],
            "name": person["name"],
            "known_for": [work["title"] if "title" in work else work["name"] for work in person.get("known_for", [])],
            "profile_image": f"https://image.tmdb.org/t/p/w500{person['profile_path']}" if person.get("profile_path") else None
        }
        for person in data.get("results", [])
    ]

    return {
        "page": data.get("page"),
        "total_pages": data.get("total_pages"),
        "total_results": data.get("total_results"),
        "actors": actors
    }

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"TMDB API error: {e}")
    except httpx.TimeoutException as e:
        raise HTTPException(status_code=504, detail=f"Request timeout: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to TMDB: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

async def get_person_details(person_id: int):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{TMDB_BASE_URL}/person/{person_id}",
                params={"language": "en-US"},
            )
            response.raise_for_status()
            details = response.json()

    return  {
        "id": details.get("id"),
        "name": details.get("name"),
        "biography": details.get("biography"),
        "birthday": details.get("birthday"),
        "place_of_birth": details.get("place_of_birth"),
        "profile_image": f"https://image.tmdb.org/t/p/w500{details['profile_path']}" if details.get("profile_path") else None
    }

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"TMDB API error: {e}")
    except httpx.TimeoutException as e:
        raise HTTPException(status_code=504, detail=f"Request timeout: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to TMDB: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")