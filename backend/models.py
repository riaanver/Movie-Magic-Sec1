import sqlalchemy
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Date, Numeric, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector
from datetime import datetime
from database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100))
    started_at = Column(DateTime, default=datetime.utcnow)
    last_message_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship: One conversation has many messages
    messages = relationship("ConversationMessage", back_populates="conversation")

    def __repr__(self):
        return f"<Conversation(id={self.id}, user_id={self.user_id})>"


class ConversationMessage(Base):
    __tablename__ = "conversation_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    role = Column(String(20), nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship: Each message belongs to one conversation
    conversation = relationship("Conversation", back_populates="messages")

    def __repr__(self):
        return f"<ConversationMessage(id={self.id}, role={self.role})>"


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True)  # TMDB movie ID
    original_language = Column(String(10))
    title = Column(String(500), nullable=False)
    overview = Column(Text)
    popularity = Column(Numeric(10, 3))
    release_date = Column(Date)
    vote_average = Column(Numeric(3, 1))
    vote_count = Column(Integer)
    poster_path = Column(String(200))
    backdrop_path = Column(String(200))
    genres = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship: One movie has many embeddings
    embeddings = relationship("MovieEmbedding", back_populates="movie")

    def __repr__(self):
        return f"<Movie(id={self.id}, title={self.title})>"


class MovieEmbedding(Base):
    __tablename__ = "movie_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    content_type = Column(String(50))
    content = Column(Text)
    embedding = Column(Vector(768))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship: Each embedding belongs to one movie
    movie = relationship("Movie", back_populates="embeddings")

    def __repr__(self):
        return f"<MovieEmbedding(id={self.id}, movie_id={self.movie_id})>"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    watchlists = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(120), default="My Watchlist")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="watchlists")
    items = relationship("WatchlistItem", back_populates="watchlist", cascade="all, delete-orphan")


class WatchlistItem(Base):
    __tablename__ = "watchlist_items"
    __table_args__ = (
        # Ensure a movie can only appear once per watchlist
        sqlalchemy.UniqueConstraint('watchlist_id', 'movie_id', name='uq_watchlist_movie'),
    )

    id = Column(Integer, primary_key=True, index=True)
    watchlist_id = Column(Integer, ForeignKey("watchlists.id"), nullable=False)
    movie_id = Column(Integer, nullable=False)
    movie_title = Column(String(500), nullable=False)
    poster_path = Column(String(200))
    rating = Column(Integer, nullable=True)
    watched = Column(Boolean, default=False)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    watchlist = relationship("Watchlist", back_populates="items")

    def __repr__(self):
        return f"<WatchlistItem(id={self.id}, movie={self.movie_title})>"
