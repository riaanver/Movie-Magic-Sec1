# 🎬 Movie Chatbot - AI-Powered Movie Recommendations

An intelligent, conversational movie recommendation chatbot that helps users discover movies through natural dialogue. Unlike traditional search interfaces, this chatbot understands user preferences, asks clarifying questions, and provides personalized recommendations using AI, TMDB data, and RAG (Retrieval-Augmented Generation) technology.

## 📖 Overview

Movie Chatbot is an AI-powered conversational assistant that revolutionizes movie discovery. Instead of traditional keyword searches and static filters, users engage in natural conversations where the chatbot understands context, remembers preferences, and explains recommendations with reasoning.

Built with modern AI technologies including GPT-4, OpenAI embeddings, and vector similarity search, this chatbot provides a personalized movie discovery experience that feels like talking to a knowledgeable friend who knows your taste.

## ✨ Features

### 🤖 Conversational AI
- **Natural Language Understanding** - Talk naturally, no keywords needed
- **Context Memory** - Remembers entire conversation history
- **Follow-up Questions** - Asks clarifying questions to understand taste
- **Dynamic Adaptation** - Adjusts recommendations based on feedback
- **Smart References** - Understands "it", "that movie", "yes/no" in context

### 🎯 Intelligent Recommendations
- **Personalized Suggestions** - Tailored to individual preferences
- **Explained Results** - Shows WHY movies are recommended
- **Multi-Factor Matching** - Considers themes, mood, style, actors
- **Similar Movie Discovery** - Find movies like ones you love
- **Thematic Search** - Search by mood, themes, or vibes

### 👥 Actor & Director Discovery
- **People Search** - Find movies by actors or directors
- **Filmography Display** - Complete works with posters
- **Similar Artists** - Discover related talent
- **Genre Filtering** - Filter by specific genres within filmography

### 🎨 Rich User Interface
- **Movie Posters** - Visual display with TMDB images
- **Detailed Information** - Cast, ratings, synopsis, where to watch
- **Interactive Chat** - Smooth conversation flow
- **Visual Feedback** - Typing indicators, smooth transitions

### 🔮 Advanced Features
- **RAG Technology** - Retrieval-Augmented Generation for deep insights
- **Vector Similarity** - pgvector-powered semantic search
- **User Preferences** - Learn and adapt to user taste (coming soon)
- **Watchlist** - Save movies for later (coming soon)
- **Multi-Turn Context** - Maintains conversation across messages

## 🏗️ Architecture

```
┌──────────────┐
│   User       │
│  Browser     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│   React          │
│   Frontend       │
│   + Tailwind     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   FastAPI        │
│   Backend        │
└──────┬───────────┘
       │
   ┌───┴───┐
   ▼       ▼
┌──────┐ ┌──────────┐
│ TMDB │ │ OpenAI   │
│ API  │ │ GPT-4    │
└──────┘ └──────────┘
   │
   ▼
┌──────────────────┐
│  PostgreSQL      │
│  + pgvector      │
└──────────────────┘
```

## 🛠️ Technology Stack

### Frontend
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | React + Vite | Fast, modern UI |
| **Styling** | Tailwind CSS | Utility-first styling |
| **State Management** | React Context/Redux | Global state |
| **HTTP Client** | Axios/Fetch | API communication |
| **Deployment** | Vercel/Netlify | Hosting (Free) |

**Alternative Frontend Options:**
- Next.js - SSR + React
- Vue.js - Simpler syntax
- Svelte - Best performance
- Angular - Enterprise-grade

### Backend
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | FastAPI | High-performance API |
| **Server** | Uvicorn | ASGI server |
| **HTTP Client** | httpx | Async requests |
| **Python** | 3.10+ | Programming language |
| **Deployment** | Railway/Render | Hosting (Free) |

### Database
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Database** | PostgreSQL 15+ | Main data store |
| **Vector Search** | pgvector | Similarity search |
| **Hosting** | Supabase | Managed database (Free) |

### AI & APIs
| Component | Technology | Purpose |
|-----------|------------|---------|
| **LLM** | OpenAI GPT-4/3.5 | Natural language |
| **Embeddings** | text-embedding-3-small | Vector embeddings |
| **Movie Data** | TMDB API | Movie/TV/Actor data |
| **RAG** | Custom implementation | Enhanced responses |

## 🚀 Getting Started

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ and npm
- PostgreSQL 15+ with pgvector
- OpenAI API key
- TMDB API key

### Backend Setup

**1. Clone the repository**
```bash
git clone https://github.com/KhonS7/Movie-Chatbot.git
cd Movie-Chatbot/backend
```

**2. Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Set up environment variables**

Create `.env` file:
```env
OPENAI_API_KEY=your_openai_key_here
TMDB_API_KEY=your_tmdb_key_here
DATABASE_URL=postgresql://user:pass@localhost:5432/moviedb
```

**5. Set up database**
```bash
# Create database
createdb moviedb

# Enable pgvector extension
psql moviedb -c "CREATE EXTENSION vector;"

# Run migrations
python -m alembic upgrade head
```

**6. Run backend server**
```bash
uvicorn main:app --reload
```

Backend will run at `http://localhost:8000`

### Frontend Setup

**1. Navigate to frontend**
```bash
cd ../frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment**

Create `.env`:
```env
VITE_API_URL=http://localhost:8000
```

**4. Run development server**
```bash
npm run dev
```

Frontend will run at `http://localhost:5173`

## 💡 How It Works

### User Flow 1: Actor-Based Discovery
```
USER: "I like Tom Holland"
  ↓
BOT: "Tom Holland is great! Want to see his movies?"
  ↓
USER: "Yes"
  ↓
BOT: Shows Tom Holland movies with posters
     - Spider-Man series
     - Uncharted
     - Cherry
  ↓
BOT: "Want to filter by genre?"
  ↓
USER: "Show me action ones"
  ↓
BOT: Shows action movies + similar recommendations
```

### User Flow 2: Taste-Based Recommendation
```
USER: "I loved Inception"
  ↓
BOT: "What did you enjoy most?
     - Mind-bending plot
     - Action scenes
     - Philosophical themes"
  ↓
USER: "The mind-bending plot"
  ↓
BOT: Shows recommendations with explanations:
     
     🎬 Shutter Island - "Like Inception, plays with reality"
     🎬 Memento - "Non-linear storytelling puzzle"
     🎬 The Prestige - "Another Nolan mind-bender"
  ↓
USER: "Tell me about Shutter Island"
  ↓
BOT: Shows details, poster, where to watch
```

## 📦 Project Structure

```
Movie-Chatbot/
│
├── 📁 backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py            # FastAPI app
│   │   ├── routers/           # API endpoints
│   │   ├── services/          # Business logic
│   │   │   ├── ai_service.py  # OpenAI integration
│   │   │   ├── tmdb_service.py # TMDB API
│   │   │   └── rag_service.py # RAG implementation
│   │   ├── models/            # Database models
│   │   └── utils/             # Helper functions
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example           # Environment template
│   └── alembic/               # Database migrations
│
├── 📁 frontend/                # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   └── Message.jsx
│   │   ├── services/          # API calls
│   │   ├── hooks/             # Custom React hooks
│   │   ├── styles/            # Tailwind configs
│   │   └── App.jsx            # Main app
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
│
├── 📁 database/                # Database scripts
│   ├── schema.sql             # Database schema
│   └── seed.sql               # Sample data
│
├── 📄 README.md                # You are here!
├── 📄 .gitignore               # Git ignore rules
└── 📄 docker-compose.yml       # Docker setup (optional)
```

## 🎯 Key Technical Achievements

✅ **RAG Implementation** - Retrieval-Augmented Generation for contextual responses  
✅ **Vector Similarity Search** - pgvector for semantic movie matching  
✅ **Conversational Context** - Multi-turn conversation memory  
✅ **Async Architecture** - FastAPI + httpx for high performance  
✅ **Real-time Streaming** - SSE for streaming AI responses  
✅ **Smart Caching** - Redis for frequently accessed data  
✅ **Error Handling** - Graceful degradation and user-friendly errors  
✅ **API Integration** - TMDB + OpenAI seamless integration  

## 🔧 API Endpoints

### Chat
```bash
POST /api/chat
{
  "message": "I like action movies",
  "conversation_id": "uuid"
}
```

### Movie Search
```bash
GET /api/movies/search?query=inception
```

### Actor Search
```bash
GET /api/actors/search?name=tom+holland
```

### Recommendations
```bash
POST /api/recommendations
{
  "movie_id": 27205,
  "preferences": ["action", "sci-fi"]
}
```

## 🎨 Customization

### Adjust AI Model
```python
# backend/app/services/ai_service.py
model = "gpt-4"  # or "gpt-3.5-turbo" for faster/cheaper
```

### Change Recommendation Count
```python
# backend/app/services/rag_service.py
MAX_RECOMMENDATIONS = 5  # Adjust number of results
```

### Customize UI Theme
```javascript
// frontend/tailwind.config.js
theme: {
  colors: {
    primary: '#1DB954',    // Spotify green
    secondary: '#191414',  // Dark theme
  }
}
```

## 📚 What You'll Learn

✅ Building conversational AI applications  
✅ Integrating OpenAI GPT models  
✅ Implementing RAG (Retrieval-Augmented Generation)  
✅ Vector databases and similarity search  
✅ FastAPI backend development  
✅ React frontend with modern hooks  
✅ API integration (TMDB, OpenAI)  
✅ Real-time chat interfaces  
✅ Context management in conversations  
✅ Database design for AI applications  

## 🔒 Security & Privacy

- **API Key Protection** - Environment variables, never committed
- **Rate Limiting** - Prevent API abuse
- **Input Validation** - Sanitize user inputs
- **CORS Configuration** - Secure cross-origin requests
- **SQL Injection Prevention** - ORM-based queries
- **User Data Privacy** - Encrypted conversations (future)

## 🚀 Deployment

### Backend (Railway/Render)
```bash
# Install Railway CLI
railway login
railway init
railway up
```

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel
vercel login
vercel --prod
```

### Database (Supabase)
1. Create project at supabase.com
2. Enable pgvector extension
3. Update DATABASE_URL in .env

## 🎯 Future Enhancements

- [ ] **User Accounts** - Authentication and profiles
- [ ] **Watchlist** - Save movies for later
- [ ] **Rating System** - Rate movies to improve recommendations
- [ ] **Social Features** - Share recommendations with friends
- [ ] **Voice Interface** - Talk to the chatbot
- [ ] **Mobile App** - React Native version
- [ ] **Streaming Integration** - Show where to watch (Netflix, etc.)
- [ ] **Mood-Based Search** - Find movies by current mood
- [ ] **Group Mode** - Recommendations for multiple people
- [ ] **Advanced Analytics** - Taste profile visualization
- [ ] **Multi-language Support** - i18n implementation
- [ ] **Offline Mode** - Cached recommendations

## 🐛 Troubleshooting

### OpenAI API Errors
```bash
# Check API key
echo $OPENAI_API_KEY

# Verify quota
curl https://api.openai.com/v1/usage
```

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL

# Check pgvector extension
psql -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
```

### TMDB API Rate Limits
```python
# Add delay between requests
import time
time.sleep(0.25)  # 4 requests per second limit
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Ideas
- 🎨 Improve UI/UX design
- 🤖 Enhance AI prompts
- 📊 Add analytics dashboard
- 🎬 More recommendation algorithms
- 🧪 Write more tests
- 📝 Improve documentation

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Khon S.**

- GitHub: [@KhonS7](https://github.com/KhonS7)
- LinkedIn: [Khon S.](https://linkedin.com/in/khon-s)
- Email: js14841@nyu.edu

## 🙏 Acknowledgments

- **OpenAI** - For GPT-4 and embeddings API
- **TMDB** - For comprehensive movie database
- **FastAPI** - For the excellent web framework
- **React Team** - For the powerful UI library
- **PostgreSQL + pgvector** - For vector similarity search
- **All Contributors** - Thank you for your support!

## Support
- 💬 **Issues:** [GitHub Issues](https://github.com/KhonS7/Movie-Chatbot/issues)
- 📖 **OpenAI Docs:** [platform.openai.com](https://platform.openai.com/docs)
- 📖 **TMDB Docs:** [developers.themoviedb.org](https://developers.themoviedb.org)
---

⭐ **If you find this project helpful, please give it a star!**

🎬 **Happy Movie Discovering!**

---

⚡ **Interested in my work? Check out my other projects:**
- [AI Code Agent](https://github.com/KhonS7/ai-code-agent) - LLM-powered autonomous coding assistant
- [Stepwise.us](https://github.com/KhonS7/Stepwise.us) - Django blog platform
- [VisualGame](https://github.com/KhonS7/VisualGame) - Computer vision games with Pygame
- [Django Polls](https://github.com/KhonS7/Django-Polls) - Voting application

**Built with ❤️ using AI, React, and FastAPI**
