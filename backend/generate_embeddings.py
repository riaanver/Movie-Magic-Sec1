"""
Script to generate vector embeddings for all movies in the database.

This script reads movies from the database and generates 768-dimensional
vector embeddings for semantic search using Google's text-embedding-004 model.

Prerequisites:
    - Run populate_movies.py first
    - Ensure GEMINI_ACCESS_TOKEN is set in .env

Usage:
    python generate_embeddings.py
"""

import sys
import time
from datetime import datetime
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Movie, MovieEmbedding
from services.embedding_service import EmbeddingService


def generate_embeddings_for_all_movies(db: Session) -> tuple:
    """
    Generate embeddings for all movies in database.

    Args:
        db: Database session

    Returns:
        Tuple of (total_processed, total_success, total_skipped, total_errors)
    """
    # Get all movies
    movies = db.query(Movie).all()
    total_movies = len(movies)

    if total_movies == 0:
        print("No movies found in database. Run populate_movies.py first.")
        return 0, 0, 0, 0

    print(f"Found {total_movies} movies in database")
    print(f"Generating embeddings...")
    print("-" * 60)

    total_processed = 0
    total_success = 0
    total_skipped = 0
    total_errors = 0

    start_time = time.time()

    for idx, movie in enumerate(movies, 1):
        try:
            # Skip if no overview
            if not movie.overview or len(movie.overview.strip()) == 0:
                total_skipped += 1
                total_processed += 1
                continue

            # Check if embedding already exists
            existing = db.query(MovieEmbedding).filter(
                MovieEmbedding.movie_id == movie.id,
                MovieEmbedding.content_type == "overview"
            ).first()

            if existing:
                total_skipped += 1
                total_processed += 1
                continue

            # Generate and store embedding
            result = EmbeddingService.store_movie_embedding(
                db=db,
                movie_id=movie.id,
                content_type="overview",
                content=movie.overview
            )

            if result:
                total_success += 1
            else:
                total_errors += 1

            total_processed += 1

            # Progress update every 10 movies
            if idx % 10 == 0:
                elapsed = time.time() - start_time
                rate = idx / elapsed if elapsed > 0 else 0
                eta = (total_movies - idx) / rate if rate > 0 else 0

                print(f"Progress: {idx}/{total_movies} | "
                      f"Success: {total_success} | "
                      f"Skipped: {total_skipped} | "
                      f"Errors: {total_errors} | "
                      f"Rate: {rate:.1f} movies/sec | "
                      f"ETA: {eta:.0f}s")

            # Small delay to respect API rate limits (Gemini has 1500 requests/minute limit)
            # This gives us ~40 requests per second max
            time.sleep(0.025)

        except Exception as e:
            print(f"Error processing movie '{movie.title}' (ID: {movie.id}): {e}")
            total_errors += 1
            total_processed += 1
            continue

    return total_processed, total_success, total_skipped, total_errors


def main():
    """Main function to generate embeddings."""
    print("=" * 60)
    print("Movie Embeddings Generation Script")
    print("=" * 60)
    print()

    db = SessionLocal()

    try:
        # Check initial counts
        movie_count = db.query(Movie).count()
        embedding_count = db.query(MovieEmbedding).count()

        print(f"Movies in database:        {movie_count}")
        print(f"Existing embeddings:       {embedding_count}")
        print()

        if movie_count == 0:
            print("No movies found. Please run populate_movies.py first.")
            sys.exit(1)

        # Generate embeddings
        start_time = datetime.now()
        processed, success, skipped, errors = generate_embeddings_for_all_movies(db)
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()

        # Final counts
        final_embedding_count = db.query(MovieEmbedding).count()

        # Summary
        print()
        print("=" * 60)
        print("Embedding Generation Complete!")
        print("=" * 60)
        print(f"Total movies processed:    {processed}")
        print(f"Embeddings created:        {success}")
        print(f"Skipped (no overview):     {skipped}")
        print(f"Errors:                    {errors}")
        print(f"Embeddings before:         {embedding_count}")
        print(f"Embeddings after:          {final_embedding_count}")
        print(f"Time taken:                {duration:.2f} seconds")
        print("=" * 60)

        if success > 0:
            print()
            print("Success! Your RAG system is now ready.")
            print("You can now:")
            print("  1. Test semantic search: POST /movies/semantic-search")
            print("  2. Use RAG-enhanced chat: POST /chat")
            print()
            print("Example query: 'mind-bending thrillers' or 'space exploration'")

    except Exception as e:
        print(f"Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

    finally:
        db.close()


if __name__ == "__main__":
    print("Starting embedding generation...")
    print()
    main()
