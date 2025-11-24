from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class ConversationCreate(BaseModel):
    user_id: str = Field(..., min_length=1, max_length=100)


class ConversationResponse(BaseModel):
    id: int
    user_id: str
    started_at: datetime
    last_message_at: datetime

    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    """Schema for message response"""
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    """Schema for creating a message"""
    conversation_id: int
    role: str = Field(..., pattern="^(user|assistant)$")  # Only 'user' or 'assistant'
    content: str = Field(..., min_length=1)

class ChatMessageRequest(BaseModel):
    """Schema for chat message request"""
    message: str = Field(..., min_length=1, description="User's message")
    conversation_id: Optional[int] = Field(None, description="Existing conversation ID (optional)")
    user_id: str = Field(..., min_length=1, max_length=100, description="User identifier")

    class Config:
        json_schema_extra = {
            "example": {
                "message": "I love action movies with great plot twists",
                "conversation_id": None,
                "user_id": "khon"
            }
        }

class MovieRecommendation(BaseModel):
    """Schema for individual movie recommendation"""
    id: int = Field(..., description="TMDB movie ID")
    title: str = Field(..., description="Movie title")
    reason: Optional[str] = Field(None, description="Why this movie is recommended")
    poster_path: Optional[str] = Field(None, description="Poster image path")
    vote_average: Optional[float] = Field(None, description="TMDB rating")
    release_date: Optional[str] = Field(None, description="Release date")
    overview: Optional[str] = Field(None, description="Movie overview")
    thrillers: Optional[List[dict]] = Field(default_factory=list, description="Related thriller recommendations")


class ChatMessageResponse(BaseModel):
    """Schema for chat message response with structured movie data"""
    message: str = Field(..., description="AI's conversational response")
    conversation_id: int = Field(..., description="Conversation ID")
    movies: List[MovieRecommendation] = Field(default_factory=list, description="Movie recommendations")

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Great! Here are some mind-bending thrillers you'll love:",
                "conversation_id": 1,
                "movies": [
                    {
                        "id": 550,
                        "title": "Fight Club",
                        "reason": "Psychological thriller with plot twists",
                        "thrillers": [
                            {"id": 680, "title": "Pulp Fiction"}
                        ]
                    }
                ]
            }
        }


class MovieBase(BaseModel):
    id: int
    title: str
    overview: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[float] = None
    poster_path: Optional[str] = None


class MovieDetail(MovieBase):
    original_language: Optional[str] = None
    popularity: Optional[float] = None
    vote_count: Optional[int] = None
    backdrop_path: Optional[str] = None
    genres: Optional[dict] = None

    class Config:
        from_attributes = True

class MovieSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Search query")
    limit: Optional[int] = Field(10, ge=1, le=50, description="Number of results")

class MovieRecommendationRequest(BaseModel):
    user_preferences: str = Field(..., description="User's movie preferences")
    limit: Optional[int] = Field(5, ge=1, le=20, description="Number of recommendations")


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class WatchlistItemBase(BaseModel):
    movie_id: int
    movie_title: str
    poster_path: Optional[str] = None
    notes: Optional[str] = None


class WatchlistItemCreate(WatchlistItemBase):
    pass


class WatchlistItemResponse(WatchlistItemBase):
    id: int
    rating: Optional[int] = Field(None, ge=1, le=5)
    watched: bool
    created_at: datetime

    class Config:
        from_attributes = True


class WatchlistResponse(BaseModel):
    id: int
    title: str
    items: List[WatchlistItemResponse]


class RatingUpdate(BaseModel):
    rating: int = Field(..., ge=1, le=5)


class WatchedUpdate(BaseModel):
    watched: bool
