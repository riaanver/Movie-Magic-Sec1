"""
Integration coverage for FastAPI endpoints.

Exercises conversation, chat, TMDB proxy, and semantic-search endpoints.
"""

from unittest.mock import AsyncMock, Mock, patch

import pytest


@pytest.mark.integration
class TestHealthEndpoints:
    def test_root(self, client):
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_health(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        assert "timestamp" in response.json()


@pytest.mark.integration
class TestConversationEndpoints:
    def test_create(self, client):
        response = client.post("/conversations?user_id=cli_user")
        assert response.status_code == 201
        assert response.json()["user_id"] == "cli_user"

    def test_get_by_id(self, client, sample_conversation):
        response = client.get(f"/conversations/{sample_conversation.id}")
        assert response.status_code == 200
        assert response.json()["id"] == sample_conversation.id

    def test_get_user_conversations(self, client):
        client.post("/conversations?user_id=bulk")
        client.post("/conversations?user_id=bulk")
        response = client.get("/conversations/user/bulk")
        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_delete(self, client, sample_conversation):
        response = client.delete(f"/conversations/{sample_conversation.id}")
        assert response.status_code == 204

    def test_messages(self, client, sample_conversation, sample_messages):
        response = client.get(f"/conversations/{sample_conversation.id}/messages")
        assert response.status_code == 200
        assert len(response.json()) == len(sample_messages)


@pytest.mark.integration
class TestChatEndpoint:
    @patch("services.gemini_service.genai")
    @patch("services.embedding_service.genai")
    def test_chat_flow(self, mock_embed_genai, mock_gemini_genai, client):
        mock_model = Mock()
        mock_model.generate_content.return_value = Mock(text="AI reply")
        mock_gemini_genai.GenerativeModel.return_value = mock_model
        mock_embed_genai.embed_content.return_value = {"embedding": [0.1] * 768}

        payload = {"user_id": "chat_user", "message": "Suggest a movie", "conversation_id": None}
        response = client.post("/chat", json=payload)
        assert response.status_code == 200
        assert "response" in response.json()


@pytest.mark.integration
class TestMovieEndpoints:
    @pytest.mark.asyncio
    async def test_popular(self, async_client, mock_tmdb_popular_response):
        with patch("main.TMDBService.get_popular_movies", new_callable=AsyncMock) as mock_service:
            mock_service.return_value = mock_tmdb_popular_response
            response = await async_client.get("/movies/popular")
        assert response.status_code == 200
        assert response.json()["results"][0]["title"] == "Fight Club"

    @pytest.mark.asyncio
    async def test_top_rated(self, async_client, mock_tmdb_popular_response):
        with patch("main.TMDBService.get_top_rated_movies", new_callable=AsyncMock) as mock_service:
            mock_service.return_value = mock_tmdb_popular_response
            response = await async_client.get("/movies/top-rated")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_upcoming(self, async_client, mock_tmdb_popular_response):
        with patch("main.TMDBService.get_upcoming_movies", new_callable=AsyncMock) as mock_service:
            mock_service.return_value = mock_tmdb_popular_response
            response = await async_client.get("/movies/upcoming")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_movie_details(self, async_client):
        with patch("main.TMDBService.get_movie_details", new_callable=AsyncMock) as mock_service:
            mock_service.return_value = {"id": 42}
            response = await async_client.get("/movies/42")
        assert response.status_code == 200
        assert response.json()["id"] == 42

    @pytest.mark.asyncio
    async def test_person_endpoints(self, async_client):
        with patch("main.TMDBService.search_person", new_callable=AsyncMock) as mock_search:
            mock_search.return_value = {"results": [{"id": 100}]}
            response = await async_client.get("/person/search", params={"query": "tom"})
            assert response.status_code == 200
            assert response.json()["results"][0]["id"] == 100

        with patch("main.TMDBService.get_person_credits", new_callable=AsyncMock) as mock_credits:
            mock_credits.return_value = {"cast": []}
            response = await async_client.get("/person/100/credits")
            assert response.status_code == 200
            assert "cast" in response.json()


@pytest.mark.integration
class TestSemanticSearch:
    @patch("services.embedding_service.genai")
    def test_semantic_search_success(self, mock_genai, client, sample_embedding):
        mock_genai.embed_content.return_value = {"embedding": [0.1] * 768}
        response = client.post("/movies/semantic-search", json={"query": "thrillers", "limit": 2})
        assert response.status_code == 200
        payload = response.json()
        assert payload["query"] == "thrillers"
        assert "results" in payload

    def test_semantic_search_validation(self, client):
        response = client.post("/movies/semantic-search", json={"query": "", "limit": 2})
        assert response.status_code == 400


@pytest.mark.integration
class TestAuthEndpoints:
    def test_register_login_flow(self, client):
        payload = {"email": "newuser@example.com", "password": "secure456"}
        register = client.post("/auth/register", json=payload)
        assert register.status_code == 201

        login = client.post("/auth/login", json=payload)
        assert login.status_code == 200
        assert "access_token" in login.json()

    def test_login_invalid_credentials(self, client):
        response = client.post("/auth/login", json={"email": "missing@example.com", "password": "bad"})
        assert response.status_code == 401

    def test_get_current_user(self, client, auth_headers):
        response = client.get("/auth/me", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["email"] == "tester@example.com"


@pytest.mark.integration
class TestWatchlistEndpoints:
    def test_requires_auth(self, client):
        resp = client.get("/watchlist")
        assert resp.status_code == 401

    def test_add_list_rate_toggle(self, client, auth_headers):
        payload = {"movie_id": 10, "movie_title": "Mock Movie", "poster_path": "/poster.jpg"}
        created = client.post("/watchlist", json=payload, headers=auth_headers)
        assert created.status_code == 201
        item_id = created.json()["id"]

        listing = client.get("/watchlist", headers=auth_headers)
        assert listing.status_code == 200
        assert listing.json()[0]["movie_id"] == 10

        rate = client.patch(
            f"/watchlist/{item_id}/rating", json={"rating": 4}, headers=auth_headers
        )
        assert rate.status_code == 200
        assert rate.json()["rating"] == 4

        toggle = client.patch(
            f"/watchlist/{item_id}/watched", json={"watched": True}, headers=auth_headers
        )
        assert toggle.status_code == 200
        assert toggle.json()["watched"] is True

        delete = client.delete(f"/watchlist/{item_id}", headers=auth_headers)
        assert delete.status_code == 204
