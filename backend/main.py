from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import get_db, engine
from models import Base, User
from schemas import (
    ConversationResponse,
    MessageResponse,
    ChatMessageRequest,
    ChatMessageResponse,
    MovieSearchRequest,
    UserCreate,
    UserResponse,
    TokenResponse,
    LoginRequest,
    WatchlistItemCreate,
    WatchlistItemResponse,
    RatingUpdate,
    WatchedUpdate,
)
from services import (
    ConversationService,
    TMDBService,
    GeminiService,
    EmbeddingService,
    AuthService,
    WatchlistService,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Movie Chatbot API",
    description="AI-powered movie recommendation chatbot",
    version="1.0.0"
)

# CORS configuration - restrict to specific origins in production
# For development, allow localhost with various ports
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js default dev server
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    # Add your production frontend URLs here:
    # "https://yourdomain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    email = AuthService.decode_token(token)
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = AuthService.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@app.get("/")
def root():
    return {
        "status": "healthy",
        "message": "Movie Chatbot API is running!",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/conversations", response_model=ConversationResponse, status_code=201)
def create_conversation(user_id: str, db: Session = Depends(get_db)):
    """Create a new conversation"""
    return ConversationService.create_conversation(db, user_id)


@app.get("/conversations/{conversation_id}", response_model=ConversationResponse)
def get_conversation(conversation_id: int, db: Session = Depends(get_db)):
    conversation = ConversationService.get_conversation_by_id(db, conversation_id)

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return conversation

@app.get("/conversations/user/{user_id}", response_model=List[ConversationResponse])
def get_user_conversations(user_id: str, db: Session = Depends(get_db)):
    return ConversationService.get_user_conversations(db, user_id)

@app.delete("/conversations/{conversation_id}", status_code=204)
def delete_conversation(conversation_id: int, db: Session = Depends(get_db)):
    """Delete a conversation and all its messages"""
    deleted = ConversationService.delete_conversation(db, conversation_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return None

@app.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
def get_conversation_messages(conversation_id: int, db: Session = Depends(get_db)):
    """Get all messages in a conversation"""
    conversation = ConversationService.get_conversation_by_id(db, conversation_id)

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return ConversationService.get_conversation_messages(db, conversation_id)


@app.post("/auth/register", response_model=UserResponse, status_code=201)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    try:
        return AuthService.register_user(db, user_in)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/auth/login", response_model=TokenResponse)
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    user = AuthService.authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = AuthService.create_access_token(user.email)
    return TokenResponse(access_token=token)


@app.get("/auth/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/chat", response_model=ChatMessageResponse)
async def chat(request: ChatMessageRequest, db: Session = Depends(get_db)):
    try:
        conversation = ConversationService.get_or_create_conversation(
            db,
            request.user_id,
            request.conversation_id
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    ConversationService.add_message(
        db,
        conversation.id,
        role="user",
        content=request.message
    )

    # Get conversation history for context
    conversation_messages = ConversationService.get_conversation_messages(
        db,
        conversation.id
    )

    # Format messages for Gemini
    formatted_messages = [
        {"role": msg.role, "content": msg.content}
        for msg in conversation_messages
    ]

    # RAG: Search for similar movies using semantic search
    similar_movies = EmbeddingService.search_similar_movies(
        db,
        request.message,
        limit=5
    )

    # If relevant movies found, augment context with movie data (including TMDB IDs)
    if similar_movies:
        movie_context = "Relevant movies from our database (use these TMDB IDs in your response):\n\n"
        for movie in similar_movies:
            movie_context += f"- {movie.get('title', 'Unknown')} (TMDB ID: {movie.get('id', 'N/A')}, {movie.get('release_date', 'N/A')[:4]})\n"
            movie_context += f"  Rating: {movie.get('vote_average', 'N/A')}/10\n"
            if movie.get('overview'):
                movie_context += f"  Overview: {movie['overview']}\n"
            movie_context += f"  Similarity: {movie.get('similarity', 0):.2f}\n\n"

        # Insert movie context at the beginning for Gemini to use
        formatted_messages.insert(0, {
            "role": "system",
            "content": movie_context
        })

    # Generate structured AI response using Gemini with RAG-enhanced context
    structured_response = GeminiService.generate_structured_response(formatted_messages)

    # Enrich movie recommendations with TMDB data and thriller picks
    enriched_movies = []
    for movie_data in structured_response.get("movies", []):
        movie_id = movie_data.get("id", 0)

        # If we have a valid movie ID, fetch details from TMDB
        if movie_id and movie_id > 0:
            try:
                # Get movie details
                details = await TMDBService.get_movie_details(movie_id)

                # Get thriller recommendations for this movie
                thrillers = await TMDBService.get_thriller_recommendations(movie_id, limit=3)

                # Get trailer for this movie
                trailer_key = await TMDBService.get_movie_videos(movie_id)

                enriched_movies.append({
                    "id": movie_id,
                    "title": details.get("title", movie_data.get("title")),
                    "reason": movie_data.get("reason", ""),
                    "poster_path": details.get("poster_path"),
                    "vote_average": details.get("vote_average"),
                    "release_date": details.get("release_date"),
                    "overview": details.get("overview"),
                    "trailer_key": trailer_key,
                    "thrillers": [
                        {"id": t.get("id"), "title": t.get("title"), "poster_path": t.get("poster_path")}
                        for t in thrillers
                    ]
                })
            except Exception as e:
                print(f"Error enriching movie {movie_id}: {e}")
                # Fallback: use data from Gemini
                enriched_movies.append(movie_data)
        else:
            # No valid ID, use what Gemini provided
            enriched_movies.append(movie_data)

    # Save assistant message (store as JSON for future reference)
    import json
    assistant_content = json.dumps({
        "message": structured_response.get("message", ""),
        "movies": enriched_movies
    })

    ConversationService.add_message(
        db,
        conversation.id,
        role="assistant",
        content=assistant_content
    )

    return ChatMessageResponse(
        message=structured_response.get("message", ""),
        conversation_id=conversation.id,
        movies=enriched_movies
    )


@app.get("/movies/popular")
async def get_popular_movies(page: int = 1):
    """Get popular movies from TMDB"""
    try:
        return await TMDBService.get_popular_movies(page)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}")

@app.get("/movies/top-rated")
async def get_top_rated_movies(page: int = 1):
    """Get top rated movies from TMDB"""
    try:
        return await TMDBService.get_top_rated_movies(page)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}")

@app.get("/movies/upcoming")
async def get_upcoming_movies(page: int = 1):
    """Get upcoming movies from TMDB"""
    try:
        return await TMDBService.get_upcoming_movies(page)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}")

@app.get("/movies/search")
async def search_movies(query: str, page: int = 1):
    try:
        return await TMDBService.search_movies(query, page)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}")

@app.get("/movies/{movie_id}")
async def get_movie_details(movie_id: int):
    """Get detailed information about a specific movie"""
    try:
        return await TMDBService.get_movie_details(movie_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}")

@app.get("/movies/{movie_id}/similar")
async def get_similar_movies(movie_id: int, page: int = 1):
    """Get movies similar to a specific movie"""
    try:
        return await TMDBService.get_similar_movies(movie_id, page)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}")

@app.get("/movies/{movie_id}/recommendations")
async def get_movie_recommendations(movie_id: int, page: int = 1):
    try:
        return await TMDBService.get_movie_recommendations(movie_id, page)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}")

@app.get("/movies/{movie_id}/credits")
async def get_movie_credits(movie_id: int):
    try:
        return await TMDBService.get_movie_credits(movie_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}")

@app.get("/person/{person_id}/credits")
async def get_person_credits(person_id: int):
    try:
        return await TMDBService.get_person_credits(person_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}")

@app.get("/person/search")
async def search_person(query: str, page: int = 1):
    try:
        return await TMDBService.search_person(query, page)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TMDB API error: {str(e)}")

@app.post("/movies/semantic-search")
async def semantic_search_movies(request: MovieSearchRequest, db: Session = Depends(get_db)):
    """
    Semantic search for movies using vector similarity.

    Searches movies by meaning rather than keywords. For example:
    - "mind-bending thrillers" finds Inception, Memento
    - "space exploration" finds Interstellar, The Martian
    - "feel-good family movies" finds appropriate matches
    """
    try:
        if not request.query or len(request.query.strip()) == 0:
            raise HTTPException(status_code=400, detail="Query cannot be empty")

        results = EmbeddingService.search_similar_movies(
            db,
            request.query,
            limit=request.limit or 10
        )

        return {
            "query": request.query,
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Semantic search error: {str(e)}")


@app.get("/watchlist", response_model=List[WatchlistItemResponse])
def get_watchlist_items(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return WatchlistService.list_items(db, current_user)


@app.post("/watchlist", response_model=WatchlistItemResponse, status_code=201)
def add_watchlist_item(
    payload: WatchlistItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return WatchlistService.add_item(db, current_user, payload)


@app.delete("/watchlist/{item_id}", status_code=204)
def remove_watchlist_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = WatchlistService.delete_item(db, current_user, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Watchlist item not found")
    return None


@app.patch("/watchlist/{item_id}/rating", response_model=WatchlistItemResponse)
def rate_watchlist_item(
    item_id: int,
    payload: RatingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return WatchlistService.update_rating(db, current_user, item_id, payload.rating)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@app.patch("/watchlist/{item_id}/watched", response_model=WatchlistItemResponse)
def toggle_watchlist_item(
    item_id: int,
    payload: WatchedUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return WatchlistService.toggle_watched(db, current_user, item_id, payload.watched)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
