"""
Script to populate the database with movies from TMDB.

This script fetches popular movies from TMDB API and stores them in the database.
Run this script once to initialize your movie database.

Usage:
    python populate_movies.py
"""

import asyncio
import sys
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import SessionLocal, engine
from models import Base, Movie
from services.tmdb_service import TMDBService


def create_tables():
    """Create all database tables if they don't exist."""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")


async def fetch_and_store_movies(db: Session, num_pages: int = 50) -> tuple:
    """
    Fetch movies from TMDB and store in database.

    Args:
        db: Database session
        num_pages: Number of pages to fetch (20 movies per page)

    Returns:
        Tuple of (total_fetched, total_stored, total_duplicates)
    """
    total_fetched = 0
    total_stored = 0
    total_duplicates = 0
    total_errors = 0

    print(f"Fetching {num_pages} pages of popular movies from TMDB...")
    print(f"Estimated movies to fetch: {num_pages * 20}")
    print("-" * 60)

    for page in range(1, num_pages + 1):
        try:
            # Fetch movies from TMDB
            response = await TMDBService.get_popular_movies(page)
            movies_data = response.get('results', [])
            total_fetched += len(movies_data)

            # Store each movie in database
            for movie_data in movies_data:
                try:
                    # Check if movie already exists
                    existing_movie = db.query(Movie).filter(Movie.id == movie_data['id']).first()

                    if existing_movie:
                        total_duplicates += 1
                        continue

                    # Create new movie record
                    movie = Movie(
                        id=movie_data['id'],
                        title=movie_data.get('title', 'Unknown'),
                        overview=movie_data.get('overview'),
                        original_language=movie_data.get('original_language'),
                        popularity=movie_data.get('popularity'),
                        release_date=datetime.strptime(movie_data['release_date'], '%Y-%m-%d').date()
                        if movie_data.get('release_date') else None,
                        vote_average=movie_data.get('vote_average'),
                        vote_count=movie_data.get('vote_count'),
                        poster_path=movie_data.get('poster_path'),
                        backdrop_path=movie_data.get('backdrop_path'),
                        genres=movie_data.get('genre_ids')  # Store as list
                    )

                    db.add(movie)
                    total_stored += 1

                except IntegrityError:
                    db.rollback()
                    total_duplicates += 1
                except Exception as e:
                    db.rollback()
                    total_errors += 1
                    print(f"Error storing movie {movie_data.get('title', 'Unknown')}: {e}")

            # Commit after each page
            db.commit()

            # Progress update
            if page % 5 == 0:
                print(f"Progress: Page {page}/{num_pages} | "
                      f"Fetched: {total_fetched} | "
                      f"Stored: {total_stored} | "
                      f"Duplicates: {total_duplicates}")

            # Small delay to respect API rate limits
            await asyncio.sleep(0.25)

        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            total_errors += 1
            continue

    return total_fetched, total_stored, total_duplicates, total_errors


async def main():
    """Main function to populate movie database."""
    print("=" * 60)
    print("Movie Database Population Script")
    print("=" * 60)
    print()

    # Create tables
    create_tables()
    print()

    # Get database session
    db = SessionLocal()

    try:
        # Check initial count
        initial_count = db.query(Movie).count()
        print(f"Movies in database before: {initial_count}")
        print()

        # Fetch and store movies
        start_time = datetime.now()
        fetched, stored, duplicates, errors = await fetch_and_store_movies(db, num_pages=50)
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()

        # Final count
        final_count = db.query(Movie).count()

        # Summary
        print()
        print("=" * 60)
        print("Population Complete!")
        print("=" * 60)
        print(f"Movies fetched from TMDB:  {fetched}")
        print(f"Movies stored:             {stored}")
        print(f"Duplicates skipped:        {duplicates}")
        print(f"Errors:                    {errors}")
        print(f"Database count before:     {initial_count}")
        print(f"Database count after:      {final_count}")
        print(f"Time taken:                {duration:.2f} seconds")
        print("=" * 60)

        if stored > 0:
            print()
            print("Next step: Run 'python generate_embeddings.py' to create vector embeddings")

    except Exception as e:
        print(f"Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

    finally:
        db.close()


if __name__ == "__main__":
    print("Starting movie population...")
    print()
    asyncio.run(main())
