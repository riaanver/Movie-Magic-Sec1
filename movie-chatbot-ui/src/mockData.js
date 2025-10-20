// Mock data structure based on TMDB API response format
// This simulates real TMDB data for the demo

export const mockMessages = [
  {
    id: 1,
    sender: 'bot',
    text: "👋 Welcome to **Movie Magic AI**! I'm your personal cinema companion. I can help you discover movies, explore actors' filmographies, and find your next favorite film. What are you in the mood for today?",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: 2,
    sender: 'bot',
    text: "Try asking me about:",
    quickActions: [
      "Movies like Inception",
      "Tom Holland films",
      "Best sci-fi movies",
      "Oscar winners 2024"
    ],
    timestamp: new Date(Date.now() - 299000),
  },
  {
    id: 3,
    sender: 'user',
    text: "I loved Inception!",
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: 4,
    sender: 'bot',
    text: "Inception is a masterpiece! 🎬 Christopher Nolan's mind-bending thriller. What captivated you most about it?",
    options: [
      { icon: '🧠', label: 'Mind-bending plot' },
      { icon: '💥', label: 'Action sequences' },
      { icon: '🎭', label: 'Complex characters' },
      { icon: '🎵', label: 'Hans Zimmer score' }
    ],
    timestamp: new Date(Date.now() - 179000),
  },
  {
    id: 5,
    sender: 'user',
    text: "The mind-bending plot!",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: 6,
    sender: 'bot',
    text: "Perfect! Here are some incredible films that will twist your perception of reality, just like Inception:",
    timestamp: new Date(Date.now() - 119000),
  },
  {
    id: 7,
    sender: 'bot',
    movies: [
      {
        id: 447,
        title: "Shutter Island",
        overview: "A psychological thriller about a U.S. Marshal investigating a psychiatric facility, where nothing is as it seems.",
        poster_path: "https://image.tmdb.org/t/p/w500/4GDy0PHYX3VRXUtwK5ysFbg3kEx.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/original/5NG8qbigQmat187K5RScFOYu8I.jpg",
        release_date: "2010-02-13",
        vote_average: 8.2,
        genres: ["Mystery", "Thriller", "Drama"],
        runtime: 138,
        explanation: "Like Inception, this film masterfully plays with reality and perception, keeping you questioning what's real until the very end.",
        director: "Martin Scorsese",
        cast: ["Leonardo DiCaprio", "Mark Ruffalo", "Ben Kingsley"]
      },
      {
        id: 77,
        title: "Memento",
        overview: "A man with short-term memory loss attempts to track down his wife's murderer using notes and tattoos.",
        poster_path: "https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/original/gCBmXiNKLu6v3vQz9JrHIvPJmKl.jpg",
        release_date: "2000-10-11",
        vote_average: 8.4,
        genres: ["Mystery", "Thriller"],
        runtime: 113,
        explanation: "Another Christopher Nolan masterpiece with non-linear storytelling that challenges your mind to piece together the puzzle.",
        director: "Christopher Nolan",
        cast: ["Guy Pearce", "Carrie-Anne Moss", "Joe Pantoliano"]
      },
      {
        id: 1124,
        title: "The Prestige",
        overview: "Two rival magicians engage in a dangerous game of one-upmanship, with devastating consequences.",
        poster_path: "https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/original/nnQ6bQr6Z1nQdJc2KYsJQZkIR.jpg",
        release_date: "2006-10-17",
        vote_average: 8.5,
        genres: ["Drama", "Mystery", "Sci-Fi"],
        runtime: 130,
        explanation: "Nolan's intricate tale of obsession and illusion will have you rewatching to catch all the cleverly hidden clues.",
        director: "Christopher Nolan",
        cast: ["Christian Bale", "Hugh Jackman", "Scarlett Johansson"]
      }
    ],
    timestamp: new Date(Date.now() - 118000),
  },
  {
    id: 8,
    sender: 'user',
    text: "These look amazing! Tell me more about Shutter Island",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: 9,
    sender: 'bot',
    movieDetail: {
      id: 447,
      title: "Shutter Island",
      tagline: "Someone is missing.",
      overview: "World War II soldier-turned-U.S. Marshal Teddy Daniels investigates the disappearance of a patient from a hospital for the criminally insane, but his efforts are compromised by troubling visions and a mysterious doctor.",
      poster_path: "https://image.tmdb.org/t/p/w500/4GDy0PHYX3VRXUtwK5ysFbg3kEx.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/original/5NG8qbigQmat187K5RScFOYu8I.jpg",
      release_date: "2010-02-13",
      vote_average: 8.2,
      vote_count: 21543,
      genres: ["Mystery", "Thriller", "Drama"],
      runtime: 138,
      budget: 80000000,
      revenue: 294804195,
      director: "Martin Scorsese",
      cast: [
        { name: "Leonardo DiCaprio", character: "Teddy Daniels", profile_path: "https://image.tmdb.org/t/p/w185/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
        { name: "Mark Ruffalo", character: "Chuck Aule", profile_path: "https://image.tmdb.org/t/p/w185/1RJxa4f5xKNy5MDcj9YVRaYFAd.jpg" },
        { name: "Ben Kingsley", character: "Dr. Cawley", profile_path: "https://image.tmdb.org/t/p/w185/vQtBqpF2HDdzbfXHDzR4u37i1Ac.jpg" }
      ],
      platforms: ["Netflix", "Prime Video", "Apple TV"],
      trivia: "The lighthouse scenes were filmed at the historic Peddocks Island in Boston Harbor.",
    },
    timestamp: new Date(Date.now() - 59000),
  },
  {
    id: 10,
    sender: 'bot',
    text: "Would you like more psychological thrillers, or shall we explore a different genre? 🎭",
    timestamp: new Date(Date.now() - 58000),
  }
];

export const mockActorData = {
  id: 1136406,
  name: "Tom Holland",
  profile_path: "https://image.tmdb.org/t/p/w500/bBRlrpJm9XkNSg0YT5LCaxqoFMX.jpg",
  biography: "Thomas Stanley Holland is an English actor. His accolades include a British Academy Film Award and three Saturn Awards...",
  birthday: "1996-06-01",
  place_of_birth: "Kingston upon Thames, England, UK",
  known_for_department: "Acting",
  popularity: 89.5,
  known_for: [
    {
      id: 429617,
      title: "Spider-Man: Far From Home",
      poster_path: "https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg",
      vote_average: 7.5,
      release_date: "2019-06-28",
      genres: ["Action", "Adventure", "Sci-Fi"]
    },
    {
      id: 335983,
      title: "Uncharted",
      poster_path: "https://image.tmdb.org/t/p/w500/tlZpSxYuBRHjcCGGJ6YhNYo4y4K.jpg",
      vote_average: 7.0,
      release_date: "2022-02-10",
      genres: ["Action", "Adventure"]
    },
    {
      id: 315635,
      title: "Spider-Man: Homecoming",
      poster_path: "https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg",
      vote_average: 7.4,
      release_date: "2017-07-05",
      genres: ["Action", "Adventure", "Sci-Fi"]
    }
  ]
};

export const quickPrompts = [
  { icon: "🎬", text: "Show me Oscar winners" },
  { icon: "🚀", text: "Best sci-fi movies" },
  { icon: "😂", text: "Funny comedies" },
  { icon: "👻", text: "Scary horror films" },
  { icon: "❤️", text: "Romantic movies" },
  { icon: "🎭", text: "Christopher Nolan films" },
];
