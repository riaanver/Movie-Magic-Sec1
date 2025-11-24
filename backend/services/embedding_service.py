import google.generativeai as genai
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from config import settings
from models import Movie, MovieEmbedding


class EmbeddingService:
    """Service for creating and searching embeddings"""

    # The embedding model we're using
    EMBEDDING_MODEL = "models/text-embedding-004"

    @staticmethod
    def create_embedding(text: str) -> List[float]:
        """
        Convert text to embedding vector

        Args:
            text: Text to convert (e.g., "A mind-bending thriller about dreams")

        Returns:
            List of 768 floats representing the text's meaning
            Example: [0.037, -0.015, -0.050, ...]

        Example:
            embedding = EmbeddingService.create_embedding("Inception is great")
            # Returns: [0.1, 0.2, 0.3, ...]
        """
        try:
            # Configure Gemini API
            genai.configure(api_key=settings.gemini_access_token)

            # Create embedding using Gemini
            result = genai.embed_content(
                model=EmbeddingService.EMBEDDING_MODEL,
                content=text
            )

            # Extract the embedding vector
            embedding = result['embedding']

            return embedding

        except Exception as e:
            print(f"Error creating embedding: {e}")
            return [0.0] * 768

    @staticmethod
    def store_movie_embedding(db: Session, movie_id: int, content_type: str = "overview", content: str = None) -> Optional[MovieEmbedding]:
        """
        Create and store embedding for a movie

        Args:
            db: Database session
            movie_id: ID of the movie
            content_type: Type of content ("overview", "plot", etc.)
            content: The text to embed (if None, gets from movie.overview)

        Returns:
            MovieEmbedding object if successful, None if failed

        Example:
            store_movie_embedding(db, 550, "overview", "An insomniac...")
        """
        try:
            # If no content provided, get movie overview from database
            if content is None:
                movie = db.query(Movie).filter(Movie.id == movie_id).first()
                if not movie or not movie.overview:
                    print(f"Warning: Movie {movie_id} has no overview")
                    return None
                content = movie.overview

            print(f"Creating embedding for movie {movie_id}...")
            embedding_vector = EmbeddingService.create_embedding(content)

            # Check if embedding already exists
            existing = db.query(MovieEmbedding).filter(
                MovieEmbedding.movie_id == movie_id,
                MovieEmbedding.content_type == content_type
            ).first()

            if existing:
                # Update existing embedding
                existing.content = content
                existing.embedding = embedding_vector
                movie_embedding = existing
            else:
                # Create new embedding
                movie_embedding = MovieEmbedding(
                    movie_id=movie_id,
                    content_type=content_type,
                    content=content,
                    embedding=embedding_vector
                )
                db.add(movie_embedding)

            db.commit()
            db.refresh(movie_embedding)

            print(f"Stored embedding for movie {movie_id}")
            return movie_embedding

        except Exception as e:
            print(f"Error storing embedding for movie {movie_id}: {e}")
            db.rollback()
            return None

    @staticmethod
    def search_similar_movies(db: Session, query: str, limit: int = 5) -> List[Dict]:
        """
        Search for movies similar to the query using vector similarity

        Uses cosine similarity to find movies with similar meaning

        Args:
            db: Database session
            query: Search query (e.g., "mind-bending thrillers")
            limit: Maximum number of results

        Returns:
            List of dicts with movie info and similarity scores
            Example: [
                {
                    "movie_id": 550,
                    "title": "Fight Club",
                    "overview": "...",
                    "similarity": 0.89
                },
                ...
            ]

        Example:
            results = EmbeddingService.search_similar_movies(
                db,
                "mind-bending sci-fi",
                limit=5
            )
        """
        try:
            # Step 1: Convert query to embedding
            print(f"Searching for: '{query}'")
            query_embedding = EmbeddingService.create_embedding(query)

            # Step 2: Search database using pgvector
            # SQL: SELECT * FROM movie_embeddings
            #      ORDER BY embedding <=> query_vector
            #      LIMIT 5
            #
            # <=> is cosine distance operator (lower = more similar)

            from sqlalchemy import text

            # Convert embedding list to PostgreSQL array format
            embedding_str = '[' + ','.join(map(str, query_embedding)) + ']'

            # Query for similar movies using cosine distance
            # Note: Using f-string for vector parameter due to SQLAlchemy limitations with vector casting
            sql_query = text(f"""
                             SELECT me.movie_id,
                                    m.title,
                                    m.overview,
                                    m.release_date,
                                    m.vote_average,
                                    m.poster_path,
                                    (1 - (me.embedding <=> '{embedding_str}'::vector)) as similarity
                             FROM movie_embeddings me
                                      JOIN movies m ON me.movie_id = m.id
                             WHERE me.content_type = 'overview'
                             ORDER BY me.embedding <=> '{embedding_str}'::vector
                             LIMIT :limit
                             """)

            result = db.execute(
                sql_query,
                {"limit": limit}
            )

            # Format results
            movies = []
            for row in result:
                movies.append({
                    "movie_id": row.movie_id,
                    "title": row.title,
                    "overview": row.overview,
                    "release_date": str(row.release_date) if row.release_date else None,
                    "vote_average": float(row.vote_average) if row.vote_average else 0,
                    "poster_path": row.poster_path,
                    "similarity": float(row.similarity)
                })

            print(f"Found {len(movies)} similar movies")
            return movies

        except Exception as e:
            print(f"Error searching similar movies: {e}")
            import traceback
            traceback.print_exc()
            return []