import httpx
from typing import List, Dict, Optional
from config import settings


class TMDBService:
    BASE_URL = "https://api.themoviedb.org/3"
    IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

    @staticmethod
    def _get_headers() -> dict:
        return {
            "Authorization": f"Bearer {settings.tmdb_access_token}",
            "accept": "application/json"
        }

    @staticmethod
    async def get_popular_movies(page: int = 1) -> Dict:
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.get(
                f"{TMDBService.BASE_URL}/movie/popular",
                headers=TMDBService._get_headers(),
                params={"language": "en-US", "page": page}
            )
            response.raise_for_status()
            return response.json()

    @staticmethod
    async def get_top_rated_movies(page: int = 1) -> Dict:
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.get(
                f"{TMDBService.BASE_URL}/movie/top_rated",
                headers=TMDBService._get_headers(),
                params={"language": "en-US", "page": page}
            )
            response.raise_for_status()
            return response.json()

    @staticmethod
    async def get_upcoming_movies(page: int = 1) -> Dict:
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.get(
                f"{TMDBService.BASE_URL}/movie/upcoming",
                headers=TMDBService._get_headers(),
                params={"language": "en-US", "page": page}
            )
            response.raise_for_status()
            return response.json()

    @staticmethod
    async def search_movies(query: str, page: int = 1) -> Dict:
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.get(
                f"{TMDBService.BASE_URL}/search/movie",
                headers=TMDBService._get_headers(),
                params={"query": query, "language": "en-US", "page": page}
            )
            response.raise_for_status()
            return response.json()

    @staticmethod
    async def get_movie_details(movie_id: int) -> Dict:
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.get(
                f"{TMDBService.BASE_URL}/movie/{movie_id}",
                headers=TMDBService._get_headers(),
                params={"language": "en-US"}
            )
            response.raise_for_status()
            return response.json()

    @staticmethod
    async def get_similar_movies(movie_id: int, page: int = 1) -> Dict:
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.get(
                f"{TMDBService.BASE_URL}/movie/{movie_id}/similar",
                headers=TMDBService._get_headers(),
                params={"language": "en-US", "page": page}
            )
            response.raise_for_status()
            return response.json()

    @staticmethod
    async def get_movie_recommendations(movie_id: int, page: int = 1) -> Dict:
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.get(
                f"{TMDBService.BASE_URL}/movie/{movie_id}/recommendations",
                headers=TMDBService._get_headers(),
                params={"language": "en-US", "page": page}
            )
            response.raise_for_status()
            return response.json()

    @staticmethod
    async def get_movie_credits(movie_id: int) -> Dict:
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.get(
                f"{TMDBService.BASE_URL}/movie/{movie_id}/credits",
                headers=TMDBService._get_headers()
            )
            response.raise_for_status()
            return response.json()

    @staticmethod
    async def get_person_credits(person_id: int) -> Dict:
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.get(
                f"{TMDBService.BASE_URL}/person/{person_id}/movie_credits",
                headers=TMDBService._get_headers()
            )
            response.raise_for_status()
            return response.json()

    @staticmethod
    async def search_person(query: str, page: int = 1) -> Dict:
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.get(
                f"{TMDBService.BASE_URL}/search/person",
                headers=TMDBService._get_headers(),
                params={"query": query, "language": "en-US", "page": page}
            )
            response.raise_for_status()
            return response.json()

    @staticmethod
    def get_image_url(path: str, size: str = "w500") -> Optional[str]:
        if not path:
            return None
        return f"{TMDBService.IMAGE_BASE_URL}/{size}{path}"

    @staticmethod
    async def discover_movies(genre_ids: Optional[List[int]] = None, sort_by: str = "popularity.desc",
                              page: int = 1, year: Optional[int] = None, vote_average_gte: Optional[float] = None) -> Dict:

        params = {
            "language": "en-US",
            "sort_by": sort_by,
            "page": page
        }

        if genre_ids:
            params["with_genres"] = ",".join(map(str, genre_ids))
        if year:
            params["primary_release_year"] = year
        if vote_average_gte:
            params["vote_average.gte"] = vote_average_gte

        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.get(
                f"{TMDBService.BASE_URL}/discover/movie",
                headers=TMDBService._get_headers(),
                params=params
            )
            response.raise_for_status()
            return response.json()

    @staticmethod
    async def get_thriller_recommendations(movie_id: Optional[int] = None, limit: int = 3) -> List[Dict]:
        """
        Get thriller movie recommendations.

        If movie_id is provided, attempts to get thrillers similar to that movie.
        Otherwise, returns top-rated thrillers.

        Args:
            movie_id: Optional movie ID to base recommendations on
            limit: Number of thriller recommendations to return (default 3)

        Returns:
            List of thriller movie dictionaries with id, title, and other TMDB fields
        """
        THRILLER_GENRE_ID = 53

        try:
            if movie_id:
                # Try to get similar movies first
                similar_response = await TMDBService.get_similar_movies(movie_id, page=1)
                similar_movies = similar_response.get("results", [])

                # Filter for thrillers
                thriller_similar = [
                    movie for movie in similar_movies
                    if THRILLER_GENRE_ID in movie.get("genre_ids", [])
                ]

                if len(thriller_similar) >= limit:
                    return thriller_similar[:limit]

                # If not enough similar thrillers, supplement with top thrillers
                remaining = limit - len(thriller_similar)
                thriller_response = await TMDBService.discover_movies(
                    genre_ids=[THRILLER_GENRE_ID],
                    sort_by="vote_average.desc",
                    page=1,
                    vote_average_gte=7.0
                )
                top_thrillers = thriller_response.get("results", [])[:remaining]
                return thriller_similar + top_thrillers

            else:
                # No movie_id provided, return top thrillers
                thriller_response = await TMDBService.discover_movies(
                    genre_ids=[THRILLER_GENRE_ID],
                    sort_by="vote_average.desc",
                    page=1,
                    vote_average_gte=7.0
                )
                return thriller_response.get("results", [])[:limit]

        except Exception as e:
            print(f"Error fetching thriller recommendations: {e}")
            # Fallback: return top thrillers
            try:
                thriller_response = await TMDBService.discover_movies(
                    genre_ids=[THRILLER_GENRE_ID],
                    sort_by="popularity.desc",
                    page=1
                )
                return thriller_response.get("results", [])[:limit]
            except:
                return []

    @staticmethod
    async def get_movie_videos(movie_id: int) -> Optional[str]:
        """
        Get YouTube trailer key for a movie.

        Args:
            movie_id: TMDB movie ID

        Returns:
            YouTube video key (e.g., "dQw4w9WgXcQ") or None if not found
        """
        try:
            async with httpx.AsyncClient(timeout=None) as client:
                response = await client.get(
                    f"{TMDBService.BASE_URL}/movie/{movie_id}/videos",
                    headers=TMDBService._get_headers(),
                    params={"language": "en-US"}
                )
                response.raise_for_status()
                data = response.json()

                # Look for YouTube trailers
                videos = data.get("results", [])
                for video in videos:
                    if video.get("site") == "YouTube" and video.get("type") == "Trailer":
                        return video.get("key")

                # If no trailer found, return first YouTube video
                for video in videos:
                    if video.get("site") == "YouTube":
                        return video.get("key")

                return None
        except Exception as e:
            print(f"Error fetching movie videos: {e}")
            return None