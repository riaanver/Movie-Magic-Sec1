# 🎬 Movie-Magic

**AI-Powered Movie Recommendation Chatbot with Natural Language Conversations**

A production-ready, intelligent movie recommendation system that understands natural language, remembers context, and provides personalized suggestions using AI, vector search, and real-time movie data.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Current Status](#current-status)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development Roadmap](#development-roadmap)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Movie-Magic-Sec1** is not your typical movie search application. Instead of filters and grids, it engages users in natural conversations, asking follow-up questions and providing personalized recommendations with detailed explanations.

### What Makes It Different?

- 🗣️ **Conversational Interface** - Chat naturally about movies, no complex filters needed
- 🧠 **Context-Aware** - Remembers your entire conversation history
- 🎯 **Semantic Search** - Understands meaning, not just keywords ("mind-bending" finds Inception)
- 🤖 **AI-Powered** - Uses Google Gemini 2.5 for intelligent responses
- 🔍 **RAG Technology** - Searches actual movie database for accurate recommendations
- 📊 **Vector Embeddings** - Finds similar movies based on semantic similarity
- 🎬 **Real-Time Data** - Integrated with TMDB API for up-to-date movie information

---

## ✨ Key Features

### Current Features (v1.0)

- ✅ **Natural Language Chat** - Talk to the bot like a movie expert friend
- ✅ **Multi-Turn Conversations** - Maintains context across messages
- ✅ **TMDB Integration** - 10 endpoints for comprehensive movie data
- ✅ **Conversation Management** - Save and retrieve conversation history
- ✅ **AI Intelligence** - Google Gemini 2.5 Flash for fast, smart responses
- ✅ **Vector Search Ready** - Database with pgvector for semantic similarity
- ✅ **Professional API** - FastAPI with OpenAPI documentation

### Planned Features (v2.0+)

- 🔄 **Advanced RAG** - Search 10,000+ movies by semantic meaning
- 👤 **User Authentication** - Personal accounts with JWT
- ⭐ **Watchlists** - Save movies to watch later
- 📊 **Personalization** - Learn user preferences over time
- 🎭 **Actor/Director Search** - Deep dive into filmographies
- 🎨 **Mood-Based Search** - "I feel like something uplifting"
- 🌐 **Multi-Source Data** - IMDb, Rotten Tomatoes, streaming availability
- 📱 **Frontend Web App** - React-based chat interface
- 🚀 **Production Deployment** - Cloud hosting with CI/CD

---

## 🛠️ Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.13+ | Core language |
| **FastAPI** | 0.115+ | Modern async web framework |
| **Uvicorn** | 0.32+ | ASGI server |
| **SQLAlchemy** | 2.0+ | ORM for database operations |
| **Pydantic** | 2.9+ | Data validation and settings |

### Database

| Technology | Purpose |
|------------|---------|
| **PostgreSQL** 17+ | Main database |
| **pgvector** 0.3+ | Vector similarity search extension |

### AI & APIs

| Service | Purpose |
|---------|---------|
| **Google Gemini 2.5 Flash** | Natural language AI (chat) |
| **Gemini text-embedding-004** | Vector embeddings (768-dim) |
| **TMDB API** | Movie/TV/actor data |

### Development Tools

- **VS Code / PyCharm** - IDE
- **Postman** - API testing
- **pgAdmin** - Database management
- **Git** - Version control

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                  (React + Tailwind CSS)                      │
│                     [Coming Soon]                            │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/WebSocket
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND API                             │
│                      (FastAPI)                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │  Conversation  │  │  TMDB Service  │  │ Gemini Service│ │
│  │    Service     │  │   (External)   │  │   (AI Chat)   │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐                    │
│  │   Embedding    │  │  Vector Search │                    │
│  │    Service     │  │     (RAG)      │                    │
│  └────────────────┘  └────────────────┘                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL + Vector Queries
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
├─────────────────────────────────────────────────────────────┤
│  conversations  │  conversation_messages  │  movies         │
│  movie_embeddings (VECTOR 768)                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow (RAG)

```
User Query: "Mind-bending sci-fi movies"
    ↓
1. Convert query to vector embedding (768 dimensions)
    ↓
2. Search movie_embeddings table using cosine similarity
    ↓
3. Find top 5 similar movies: [Inception, Interstellar, ...]
    ↓
4. Pass results + conversation history to Gemini AI
    ↓
5. AI formats intelligent response with explanations
    ↓
Response: "Based on your taste, here's Inception because..."
```

---

## 📊 Current Status

### ✅ Completed Milestones

| Milestone | Status | Features |
|-----------|--------|----------|
| **1. Database Setup** | ✅ Complete | PostgreSQL with pgvector, 4 tables, relationships |
| **2. Conversation Management** | ✅ Complete | CRUD operations, TMDB integration (10 endpoints) |
| **3. AI Integration** | ✅ Complete | Google Gemini 2.5, context-aware conversations |
| **4. RAG Setup** | 🔄 In Progress | Embedding service, vector search infrastructure |

### 🔄 In Progress

- Populating movie database with TMDB data
- Generating embeddings for movies
- Implementing semantic search
- Testing vector similarity queries

### 📅 Next Up

- Complete RAG implementation
- Add user authentication
- Build frontend interface
- Deploy to production

---

## 💻 Installation

### Prerequisites

- **Python 3.13+**
- **PostgreSQL 17+** with **pgvector** extension
- **Git**
- **Google AI Studio API Key** (free at https://aistudio.google.com)
- **TMDB API Key** (free at https://www.themoviedb.org/settings/api)

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/Movie-Magic-Sec1.git
cd Movie-Magic-Sec1/backend
```

### Step 2: Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Setup PostgreSQL Database

```bash
# Create database
createdb movie_chatbot

# Enable pgvector extension
psql -d movie_chatbot -c "CREATE EXTENSION vector;"
```

### Step 5: Configure Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Database Configuration
database_hostname=localhost
database_port=5432
database_username=your_username
database_password=your_password
database_name=movie_chatbot

# TMDB API
tmdb_access_token=your_tmdb_bearer_token_here

# Google Gemini AI
gemini_access_token=your_google_api_key_here
```

### Step 6: Initialize Database

```bash
# Database tables will be created automatically on first run
python3 main.py
```

### Step 7: Test the API

```bash
# Start server
python3 main.py

# In another terminal, test health endpoint
curl http://localhost:8000/health

# Open interactive API documentation
open http://localhost:8000/docs
```

---

## 🔐 Environment Setup

### Get API Keys

#### TMDB API Key
1. Visit https://www.themoviedb.org/settings/api
2. Create account (free)
3. Request API key
4. Copy "Bearer Token" (not API Key)

#### Google Gemini API Key
1. Visit https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

### PostgreSQL Setup

```bash
# Install PostgreSQL (macOS)
brew install postgresql@17

# Start PostgreSQL
brew services start postgresql@17

# Install pgvector
brew install pgvector

# Create database
createdb movie_chatbot

# Enable extension
psql movie_chatbot -c "CREATE EXTENSION vector;"
```

---

## 📡 API Endpoints

### Health & Status

```
GET  /              - Root health check
GET  /health        - Detailed health status
```

### Conversations

```
POST   /conversations                      - Create new conversation
GET    /conversations/{conversation_id}    - Get conversation by ID
GET    /conversations/user/{user_id}       - Get user's conversations
DELETE /conversations/{conversation_id}    - Delete conversation
GET    /conversations/{conversation_id}/messages - Get all messages
```

### Chat

```
POST /chat          - Send message and get AI response
```

**Request:**
```json
{
  "user_id": "khon",
  "message": "I love Inception",
  "conversation_id": null
}
```

**Response:**
```json
{
  "response": "Inception is brilliant! What did you enjoy most...",
  "conversation_id": 15
}
```

### Movies (TMDB)

```
GET /movies/popular                        - Popular movies
GET /movies/top-rated                      - Top rated movies
GET /movies/upcoming                       - Upcoming releases
GET /movies/search?query=inception         - Search movies
GET /movies/{movie_id}                     - Movie details
GET /movies/{movie_id}/similar             - Similar movies
GET /movies/{movie_id}/recommendations     - Recommendations
GET /movies/{movie_id}/credits             - Cast and crew
```

### People (TMDB)

```
GET /person/search?query=tom+holland       - Search actors/directors
GET /person/{person_id}/credits            - Person's filmography
```

---

## 🗄️ Database Schema

### Tables Overview

```sql
-- Conversations: User chat sessions
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    started_at TIMESTAMP DEFAULT NOW(),
    last_message_at TIMESTAMP DEFAULT NOW()
);

-- Conversation Messages: Individual messages
CREATE TABLE conversation_messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id),
    role VARCHAR(20) NOT NULL,  -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Movies: TMDB movie data
CREATE TABLE movies (
    id INTEGER PRIMARY KEY,  -- TMDB movie ID
    title VARCHAR(500) NOT NULL,
    overview TEXT,
    release_date DATE,
    vote_average NUMERIC(3,1),
    vote_count INTEGER,
    popularity NUMERIC(10,3),
    poster_path VARCHAR(200),
    backdrop_path VARCHAR(200),
    genres JSONB,
    original_language VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Movie Embeddings: Vector representations for RAG
CREATE TABLE movie_embeddings (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id),
    content_type VARCHAR(50),  -- 'overview', 'plot', etc.
    content TEXT,
    embedding VECTOR(768),  -- 768-dimensional vector
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_movie_embeddings_movie_id ON movie_embeddings(movie_id);
```

### Entity Relationships

```
conversations (1) ──< (N) conversation_messages
movies (1) ──< (N) movie_embeddings
```

---

## 🗺️ Development Roadmap

### ✅ Phase 1: Foundation (Weeks 1-2) - COMPLETE

- [x] PostgreSQL database with pgvector
- [x] FastAPI backend with 20 endpoints
- [x] TMDB API integration
- [x] SQLAlchemy ORM models
- [x] Conversation management system
- [x] Google Gemini AI integration
- [x] Context-aware conversations

### 🔄 Phase 2: RAG Implementation (Weeks 3-4) - IN PROGRESS

- [x] Embedding service (768-dim vectors)
- [ ] Populate movies database (1000+ movies)
- [ ] Generate embeddings for all movies
- [ ] Implement vector similarity search
- [ ] Integrate RAG with chat endpoint
- [ ] Test semantic search accuracy

### 📅 Phase 3: Advanced Features (Weeks 5-6)

- [ ] User authentication (JWT)
- [ ] User profiles and preferences
- [ ] Watchlist functionality
- [ ] Personalized recommendations
- [ ] Actor/Director deep dive
- [ ] Mood-based search
- [ ] Multi-source data (IMDb, RT)

### 📅 Phase 4: Frontend (Weeks 7-8)

- [ ] React + TypeScript setup
- [ ] Chat interface UI
- [ ] Movie cards with posters
- [ ] Conversation history sidebar
- [ ] Real-time typing indicators
- [ ] Responsive design (mobile-first)

### 📅 Phase 5: Production (Weeks 9-10)

- [ ] Docker containerization
- [ ] AWS/GCP deployment
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Error monitoring (Sentry)
- [ ] Performance optimization
- [ ] Rate limiting & security
- [ ] Custom domain & HTTPS

### 📅 Phase 6: Polish & Launch (Weeks 11-12)

- [ ] User testing & feedback
- [ ] Bug fixes & optimizations
- [ ] Documentation
- [ ] Demo video
- [ ] Public launch
- [ ] Marketing & outreach

---

## 💡 Usage Examples

### Example 1: Simple Movie Recommendation

**User:** "I love Inception"

**Bot:** "Inception is brilliant! 🤯 What did you enjoy most about it - the mind-bending plot, the action sequences, or Christopher Nolan's direction?"

**User:** "The mind-bending plot"

**Bot:** "Perfect! Here are some films with complex, reality-bending narratives:

🎬 **Shutter Island** - A psychological thriller that keeps you guessing until the very end
🎬 **Memento** - Another Nolan masterpiece with unique non-linear storytelling  
🎬 **The Prestige** - A puzzle-box mystery about rival magicians

Have you seen any of these?"

---

### Example 2: Actor-Based Discovery

**User:** "Show me Tom Holland movies"

**Bot:** "Tom Holland is great! Want to see his movies?"

**User:** "Yes, action ones"

**Bot:** "Here are Tom Holland's action films:

🎬 **Spider-Man: No Way Home** (2021) - The epic Spider-Verse crossover
🎬 **Uncharted** (2022) - Treasure hunting adventure with Mark Wahlberg
🎬 **Spider-Man: Far From Home** (2019) - European adventure

Want more superhero films or different actors?"

---

### Example 3: Semantic Search (RAG)

**User:** "Movies about artificial intelligence going wrong"

**Bot:** *[Searches database using vector embeddings]*

"Based on your interest in AI themes, here are some thought-provoking films:

🎬 **Ex Machina** (2014) - Explores consciousness and manipulation
🎬 **2001: A Space Odyssey** (1968) - HAL 9000's iconic malfunction
🎬 **I, Robot** (2004) - Robots developing beyond their programming

Each explores different aspects of AI ethics and dangers."

---

## 📁 Project Structure

```
Movie-Magic-Sec1/
├── backend/
│   ├── services/
│   │   ├── __init__.py
│   │   ├── conversation_service.py   # Conversation CRUD
│   │   ├── tmdb_service.py           # TMDB API integration
│   │   ├── gemini_service.py         # AI chat responses
│   │   └── embedding_service.py      # Vector embeddings & RAG
│   ├── main.py                       # FastAPI application
│   ├── database.py                   # Database connection
│   ├── models.py                     # SQLAlchemy ORM models
│   ├── schemas.py                    # Pydantic schemas
│   ├── config.py                     # Configuration & settings
│   ├── requirements.txt              # Python dependencies
│   ├── .env                          # Environment variables (not in git)
│   └── .gitignore
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── DEVELOPMENT_GUIDE.md
├── tests/
│   ├── test_conversation_service.py
│   ├── test_gemini_service.py
│   └── test_embedding_service.py
├── README.md                         # This file
└── LICENSE
```

---

## 🧪 Testing

### Run API Tests

```bash
# Start server
python3 main.py

# Test health endpoint
curl http://localhost:8000/health

# Test chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "message": "I love sci-fi movies",
    "conversation_id": null
  }'
```

### Test Vector Search

```python
from services import EmbeddingService
from database import SessionLocal

db = SessionLocal()

# Search for similar movies
results = EmbeddingService.search_similar_movies(
    db, 
    "mind-bending thrillers", 
    limit=5
)

for movie in results:
    print(f"{movie['title']}: {movie['similarity']:.2f}")
```

---

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

### Development Setup

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Khon S.**

- Email: js14841@nyu.edu
- GitHub: [@KhonS7](https://github.com/KhonS7)
- LinkedIn: [Khon S.](https://linkedin.com/in/khon-s)
- Institution: New York University (NYU)
- Focus: Backend development, AI/ML integration, RAG systems

**Interested in my work? Check out my other projects:**
- [AI Code Agent](https://github.com/KhonS7/ai-code-agent) - LLM-powered autonomous coding assistant
- [Stepwise.us](https://github.com/KhonS7/Stepwise.us) - Django blog platform
- [VisualGame](https://github.com/KhonS7/VisualGame) - Computer vision games with Pygame
- [Django Polls](https://github.com/KhonS7/Django-Polls) - Voting application

---

## 🙏 Acknowledgments

- **TMDB** for comprehensive movie data API
- **Google** for Gemini AI and embedding models
- **PostgreSQL** and **pgvector** for vector search capabilities
- **FastAPI** for the excellent Python web framework
- **Claude (Anthropic)** for guidance and learning support

---

## 📊 Project Stats

- **Lines of Code:** ~2,500+
- **API Endpoints:** 20
- **Database Tables:** 4
- **AI Models:** 2 (Chat + Embeddings)
- **Development Time:** 12 weeks (planned)
- **Learning Value:** Immense! 🚀

---

## 🔗 Links

- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [Google AI Studio](https://aistudio.google.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [pgvector Documentation](https://github.com/pgvector/pgvector)

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact: js14841@nyu.edu

---

**Built with ❤️ and lots of learning!** 🎬✨