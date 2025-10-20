# 🎬 Movie Magic AI - Cinematic Singularity UI

A stunning, modern AI-powered movie chatbot interface built with React, Vite, and Tailwind CSS. This is a **visual demonstration** showcasing the "Cinematic Singularity" design concept with glassmorphism, aurora backgrounds, and smooth animations.

## ✨ Design Features

### Visual Effects
- **Aurora Background**: Animated gradient background with deep blues and purples
- **Glassmorphism**: Frosted glass effect on cards and containers
- **Neon Glow**: Electric cyan accents with glowing effects on hover
- **Smooth Animations**: Fade-ins, slides, and micro-interactions throughout
- **Custom Components**: Beautiful movie cards, chat bubbles, and interactive elements

### Color Palette (Midnight Neon)
- Background: Deep Charcoal (#121212)
- Primary: Lighter Charcoal (#1E1E1E)
- Accent: Electric Cyan (#00E5FF)
- Text Main: Soft Off-white (#F5F5F5)
- Text Secondary: Muted Gray (#A0A0A0)

## 🎯 What's Included

### Components
- ✅ **ChatWindow** - Main glassmorphic container
- ✅ **ChatHeader** - Sleek header with status indicator
- ✅ **MessageList** - Scrollable chat area with auto-scroll
- ✅ **Message** - Dynamic user/bot chat bubbles
- ✅ **MovieCard** - Rich horizontal cards with poster, details, and actions
- ✅ **MovieDetail** - Expanded movie view with full information
- ✅ **ChatInput** - Floating pill-shaped input with glow effects
- ✅ **TypingIndicator** - Custom animated bouncing dots

### Sample Data (TMDB-Aligned)
- Actor-based discovery (Tom Holland example)
- Mind-bending movie recommendations (Inception theme)
- Multi-turn conversation flow
- Movie metadata: ratings, genres, cast, director, runtime
- AI explanations for recommendations
- Interactive quick actions and option buttons

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Navigate to the project directory**
   ```bash
   cd movie-chatbot-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📦 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library (optional enhancement)

## 🎨 Component Architecture

```
App.jsx
└── ChatWindow
    ├── ChatHeader
    ├── MessageList
    │   └── Message (multiple)
    │       ├── MovieCard (conditional)
    │       ├── MovieDetail (conditional)
    │       └── TypingIndicator (conditional)
    └── ChatInput
```

## 📊 TMDB API Integration (Future)

This UI is designed to work seamlessly with TMDB API data. The mock data structure matches TMDB's response format:

### Supported TMDB Endpoints
- `/search/movie` - Movie search
- `/search/person` - Actor/director search
- `/movie/{id}` - Movie details
- `/movie/{id}/recommendations` - Similar movies
- `/movie/{id}/credits` - Cast and crew
- `/discover/movie` - Filter by genre, year, rating
- `/trending/movie/week` - Trending movies

### Data Structure
```javascript
{
  id: 123,
  title: "Movie Title",
  overview: "Description...",
  poster_path: "/path.jpg",
  backdrop_path: "/path.jpg",
  release_date: "2024-01-01",
  vote_average: 8.5,
  genres: ["Action", "Sci-Fi"],
  runtime: 148,
  director: "Director Name",
  cast: [{ name: "Actor", character: "Role" }]
}
```

## 🎭 Sample Conversations

The demo includes realistic conversation flows:

1. **Welcome & Quick Actions** - Initial greeting with suggested queries
2. **Movie Preference** - "I loved Inception!"
3. **Clarifying Questions** - Bot asks what you enjoyed
4. **Recommendations** - Shows similar movies with explanations
5. **Detailed View** - Expanded movie information
6. **Follow-up** - Continues conversation naturally

## 🛠️ Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  accent: '#00E5FF', // Change accent color
  background: '#121212', // Change background
  // ...
}
```

### Animations
Modify keyframes in `tailwind.config.js`:
```javascript
keyframes: {
  aurora: { /* ... */ },
  bounce: { /* ... */ },
  // Add custom animations
}
```

### Mock Data
Update `src/mockData.js` to change conversation flow and movie examples.

## 🎯 Features Demonstrated

- ✅ Natural language chat interface
- ✅ Multi-turn conversation context
- ✅ Movie cards with posters and ratings
- ✅ Genre tags and metadata display
- ✅ Interactive quick action buttons
- ✅ Smooth animations and transitions
- ✅ Responsive design
- ✅ Typing indicators
- ✅ Auto-scroll to latest message
- ✅ Glassmorphic UI elements
- ✅ Glow effects on interactive elements

## 🎬 Non-Functional Demo Elements

These are visual-only in this demo:
- Watchlist buttons (no backend)
- Streaming platform badges (no real data)
- Voice input (UI only)
- Attachment button (UI only)
- Quick action suggestions (static)

## 📝 Next Steps for Full Implementation

1. **Backend Integration**
   - Connect to FastAPI backend
   - Implement TMDB API calls
   - Add OpenAI integration for AI responses

2. **State Management**
   - Add Redux or Zustand for global state
   - Implement conversation history
   - User authentication

3. **Enhanced Features**
   - Real-time search as you type
   - Infinite scroll for movie lists
   - Watchlist persistence
   - User preferences

4. **Deployment**
   - Deploy frontend to Vercel/Netlify
   - Connect to production backend
   - Add environment variables

## 📄 License

This is a demo project for educational purposes.

## 🙏 Credits

- **TMDB API** - Movie data (https://www.themoviedb.org/)
- **Design Concept** - "Cinematic Singularity" by the team
- **Icons** - Lucide React (https://lucide.dev/)
- **Fonts** - Inter by Google Fonts

---

**Built with ❤️ for the PopcornProgrammers team**

*This is a visual demonstration. Full functionality requires backend integration.*
