"""
Aggregate unit tests for service layer modules.

Includes coverage for conversation, embedding, Gemini, and TMDB services.
"""

from datetime import datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, Mock, patch

import pytest

from schemas import WatchlistItemCreate
from services import (
    ConversationService,
    EmbeddingService,
    GeminiService,
    TMDBService,
    WatchlistService,
)


@pytest.mark.unit
class TestConversationService:
    """Conversation service tests."""

    def test_create_conversation(self, test_db):
        conversation = ConversationService.create_conversation(test_db, "unit_user")
        assert conversation.id is not None
        assert conversation.user_id == "unit_user"

    def test_get_or_create_conversation_existing(self, test_db, sample_conversation):
        convo = ConversationService.get_or_create_conversation(
            test_db, sample_conversation.user_id, sample_conversation.id
        )
        assert convo.id == sample_conversation.id

    def test_get_or_create_conversation_missing(self, test_db):
        with pytest.raises(ValueError):
            ConversationService.get_or_create_conversation(test_db, "someone", 123456)

    def test_add_message_updates_last_timestamp(self, test_db, sample_conversation):
        before = sample_conversation.last_message_at
        message = ConversationService.add_message(test_db, sample_conversation.id, "user", "Ping")
        assert message.id is not None
        refreshed = ConversationService.get_conversation_by_id(test_db, sample_conversation.id)
        assert refreshed.last_message_at >= before

    def test_get_user_conversations_sorted(self, test_db):
        convo1 = ConversationService.create_conversation(test_db, "sort_user")
        convo2 = ConversationService.create_conversation(test_db, "sort_user")
        conversations = ConversationService.get_user_conversations(test_db, "sort_user")
        assert conversations[0].id == convo2.id  # newest first
        assert conversations[1].id == convo1.id


@pytest.mark.unit
class TestGeminiService:
    """Gemini service unit tests."""

    def test_format_conversation(self):
        formatted = GeminiService._format_conversation(
            [{"role": "user", "content": "Hello"}, {"role": "assistant", "content": "Hi!"}]
        )
        assert "User: Hello" in formatted
        assert "Assistant: Hi!" in formatted

    @patch("services.gemini_service.genai")
    def test_generate_response_success(self, mock_genai):
        mock_model = Mock()
        mock_model.generate_content.return_value = Mock(text="Response")
        mock_genai.GenerativeModel.return_value = mock_model

        response = GeminiService.generate_response([{"role": "user", "content": "Hi"}])
        assert response == "Response"
        mock_genai.configure.assert_called_once()

    @patch("services.gemini_service.genai")
    def test_generate_response_handles_error(self, mock_genai):
        mock_genai.configure.side_effect = RuntimeError("Boom")
        response = GeminiService.generate_response([])
        assert "trouble processing" in response.lower()


@pytest.mark.unit
class TestEmbeddingService:
    """Embedding service coverage."""

    @patch("services.embedding_service.EmbeddingService.create_embedding", return_value=[0.2] * 768)
    def test_store_movie_embedding_creates_record(self, mock_create, test_db, sample_movie):
        embedding = EmbeddingService.store_movie_embedding(test_db, sample_movie.id, "overview")
        assert embedding is not None
        assert embedding.movie_id == sample_movie.id
        mock_create.assert_called_once()

    @patch("services.embedding_service.EmbeddingService.create_embedding", return_value=[0.3] * 768)
    def test_store_movie_embedding_updates_existing(self, mock_create, test_db, sample_embedding):
        updated = EmbeddingService.store_movie_embedding(test_db, sample_embedding.movie_id, "overview")
        assert updated.id == sample_embedding.id
        assert updated.content is not None
        mock_create.assert_called_once()

    @patch("services.embedding_service.EmbeddingService.create_embedding", return_value=[0.5] * 768)
    def test_search_similar_movies_returns_results(self, mock_create):
        mock_db = MagicMock()
        mock_db.execute.return_value = [
            SimpleNamespace(
                movie_id=1,
                title="Mock Movie",
                overview="Overview",
                release_date=datetime(2020, 1, 1),
                vote_average=8.7,
                poster_path="/poster.jpg",
                similarity=0.92,
            )
        ]

        results = EmbeddingService.search_similar_movies(mock_db, "mind bending")

        assert len(results) == 1
        assert results[0]["title"] == "Mock Movie"
        assert results[0]["similarity"] == pytest.approx(0.92)
        mock_create.assert_called_once()
        mock_db.execute.assert_called_once()

    def test_search_similar_movies_handles_failure(self):
        mock_db = MagicMock()
        mock_db.execute.side_effect = RuntimeError("DB down")
        with patch("services.embedding_service.EmbeddingService.create_embedding", return_value=[0.1] * 768):
            results = EmbeddingService.search_similar_movies(mock_db, "query")
        assert results == []


@pytest.mark.unit
class TestTMDBService:
    """Asynchronous TMDB client tests with mocked HTTPX client."""

    @pytest.mark.asyncio
    async def test_get_popular_movies(self):
        mock_response = AsyncMock()
        mock_response.json.return_value = {"results": []}
        mock_response.raise_for_status.return_value = None

        client_instance = AsyncMock()
        client_instance.__aenter__.return_value = client_instance
        client_instance.get.return_value = mock_response

        with patch("services.tmdb_service.httpx.AsyncClient", return_value=client_instance):
            data = await TMDBService.get_popular_movies()

        assert data == {"results": []}
        client_instance.get.assert_awaited()

    @pytest.mark.asyncio
    async def test_get_movie_details(self):
        mock_response = AsyncMock()
        mock_response.json.return_value = {"id": 123}
        mock_response.raise_for_status.return_value = None

        client_instance = AsyncMock()
        client_instance.__aenter__.return_value = client_instance
        client_instance.get.return_value = mock_response

        with patch("services.tmdb_service.httpx.AsyncClient", return_value=client_instance):
            data = await TMDBService.get_movie_details(123)

        assert data["id"] == 123
        client_instance.get.assert_awaited()

    @pytest.mark.asyncio
    async def test_search_person(self):
        mock_response = AsyncMock()
        mock_response.json.return_value = {"results": [{"id": 1}]}
        mock_response.raise_for_status.return_value = None

        client_instance = AsyncMock()
        client_instance.__aenter__.return_value = client_instance
        client_instance.get.return_value = mock_response

        with patch("services.tmdb_service.httpx.AsyncClient", return_value=client_instance):
            data = await TMDBService.search_person("tom")

        assert data["results"][0]["id"] == 1
        client_instance.get.assert_awaited()


@pytest.mark.unit
class TestWatchlistService:
    def test_add_and_list_items(self, test_db, auth_user):
        item = WatchlistService.add_item(
            test_db,
            auth_user,
            WatchlistItemCreate(movie_id=1, movie_title="Sample", poster_path=None, notes=None),
        )
        assert item.movie_id == 1

        items = WatchlistService.list_items(test_db, auth_user)
        assert len(items) == 1

    def test_toggle_and_rate(self, test_db, auth_user):
        item = WatchlistService.add_item(
            test_db,
            auth_user,
            WatchlistItemCreate(movie_id=2, movie_title="Toggle", poster_path=None, notes=None),
        )
        updated = WatchlistService.toggle_watched(test_db, auth_user, item.id, True)
        assert updated.watched is True
        rated = WatchlistService.update_rating(test_db, auth_user, item.id, 5)
        assert rated.rating == 5
