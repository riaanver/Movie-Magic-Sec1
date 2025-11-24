"""
Test configuration and fixtures for the Movie-Magic backend.

This module provides pytest fixtures for testing database operations,
API endpoints, and services.
"""

import pytest
import pytest_asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from datetime import datetime
from httpx import AsyncClient

from database import Base, get_db
from main import app
from models import Conversation, ConversationMessage, Movie, MovieEmbedding, User
from config import settings
from services import AuthService


# Use PostgreSQL test database (same as dev but different name)
SQLALCHEMY_DATABASE_URL = f'postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/movie_chatbot_test'


@pytest.fixture(scope="function")
def test_db():
    """
    Create a fresh test database for each test function.

    Uses PostgreSQL test database for accurate testing.
    Yields a database session and cleans up after the test.
    """
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Create all tables
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Clean up tables after test
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(test_db):
    """
    Create a test client with database dependency override.

    Returns FastAPI TestClient for making API requests in tests.
    """
    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def async_client(test_db):
    """
    Async HTTP client that mirrors FastAPI dependency overrides.
    Useful for exercising async endpoints with httpx.AsyncClient.
    """

    def override_get_db():
        try:
            yield test_db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(app=app, base_url="http://testserver") as client:
        yield client

    app.dependency_overrides.clear()


@pytest.fixture
def sample_conversation(test_db):
    """Create a sample conversation for testing."""
    conversation = Conversation(
        user_id="test_user",
        started_at=datetime.utcnow(),
        last_message_at=datetime.utcnow()
    )
    test_db.add(conversation)
    test_db.commit()
    test_db.refresh(conversation)
    return conversation


@pytest.fixture
def sample_messages(test_db, sample_conversation):
    """Create sample messages for testing."""
    messages = [
        ConversationMessage(
            conversation_id=sample_conversation.id,
            role="user",
            content="I love action movies",
            created_at=datetime.utcnow()
        ),
        ConversationMessage(
            conversation_id=sample_conversation.id,
            role="assistant",
            content="Great! Here are some action movies...",
            created_at=datetime.utcnow()
        )
    ]

    for msg in messages:
        test_db.add(msg)

    test_db.commit()

    for msg in messages:
        test_db.refresh(msg)

    return messages


@pytest.fixture
def sample_movie(test_db):
    """Create a sample movie for testing."""
    movie = Movie(
        id=550,
        title="Fight Club",
        overview="An insomniac office worker and a soap salesman form an underground fight club.",
        original_language="en",
        popularity=45.5,
        release_date=datetime(1999, 10, 15).date(),
        vote_average=8.4,
        vote_count=28000,
        poster_path="/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        backdrop_path="/5TiwfWEaPSwD20uwXjCTUqpQX70.jpg",
        genres=[18, 53]
    )
    test_db.add(movie)
    test_db.commit()
    test_db.refresh(movie)
    return movie


@pytest.fixture
def sample_embedding(test_db, sample_movie):
    """Create a sample movie embedding for testing."""
    embedding = MovieEmbedding(
        movie_id=sample_movie.id,
        content_type="overview",
        content=sample_movie.overview,
        embedding=[0.1] * 768  # Dummy 768-dim vector
    )
    test_db.add(embedding)
    test_db.commit()
    test_db.refresh(embedding)
    return embedding


@pytest.fixture
def mock_gemini_response():
    """Mock Gemini API response."""
    return "This is a test response from Gemini AI."


@pytest.fixture
def mock_tmdb_popular_response():
    """Mock TMDB popular movies response."""
    return {
        "page": 1,
        "results": [
            {
                "id": 550,
                "title": "Fight Club",
                "overview": "An insomniac office worker...",
                "release_date": "1999-10-15",
                "vote_average": 8.4,
                "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
                "backdrop_path": "/5TiwfWEaPSwD20uwXjCTUqpQX70.jpg",
                "genre_ids": [18, 53],
                "popularity": 45.5,
                "vote_count": 28000,
                "original_language": "en"
            }
        ],
        "total_pages": 50,
        "total_results": 1000
    }


@pytest.fixture
def mock_embedding_vector():
    """Mock 768-dimensional embedding vector."""
    return [0.1] * 768


@pytest.fixture
def auth_user(test_db):
    """Create a user for auth-protected routes."""
    user = User(
        email="tester@example.com",
        hashed_password=AuthService.get_password_hash("password123"),
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture
def auth_headers(auth_user):
    token = AuthService.create_access_token(auth_user.email)
    return {"Authorization": f"Bearer {token}"}
