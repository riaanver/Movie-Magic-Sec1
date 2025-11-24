export type ChatRole = "user" | "assistant";

export interface MovieRecommendation {
  id: number;
  title: string;
  reason?: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
  overview?: string;
  trailer_key?: string;
  thrillers?: Array<{ id: number; title: string; poster_path?: string }>;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  movies?: MovieRecommendation[];
  metadata?: {
    sentiment?: string;
    recommendedMovies?: MovieSummary[];
  };
}

export interface SendMessagePayload {
  userId: string;
  message: string;
  conversationId?: number;
}

export interface ChatResponse {
  message: string;
  conversation_id: number;
  movies?: MovieRecommendation[];
}

export interface ConversationSummary {
  id: number;
  user_id: string;
  started_at: string;
  last_message_at: string;
}

export interface ConversationMessage {
  id: number;
  conversation_id: number;
  role: ChatRole;
  content: string;
  created_at: string;
}

export interface MovieSummary {
  id: number;
  title: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  poster_path?: string;
  backdrop_path?: string;
  genres?: Array<{ id: number; name: string }>;
  genre_ids?: number[];
}

export interface PaginatedMovieResponse {
  page: number;
  results: MovieSummary[];
  total_pages: number;
  total_results: number;
}

export interface SemanticSearchPayload {
  query: string;
  limit?: number;
}

export interface SemanticSearchResponse {
  query: string;
  results: Array<MovieSummary & { similarity?: number }>;
  count: number;
}

export interface MovieCredits {
  id: number;
  cast: CastCredit[];
  crew: CrewCredit[];
}

export interface CastCredit {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
  order?: number;
}

export interface CrewCredit {
  id: number;
  name: string;
  job?: string;
  department?: string;
  profile_path?: string | null;
}

export interface PersonSummary {
  id: number;
  name: string;
  known_for_department?: string;
  profile_path?: string | null;
  popularity?: number;
}

export interface PaginatedPersonResponse {
  page: number;
  results: PersonSummary[];
  total_pages: number;
  total_results: number;
}

export interface PersonCredits {
  id: number;
  cast: PersonCreditMedia[];
  crew: PersonCreditMedia[];
}

export interface PersonCreditMedia {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv";
  character?: string;
  job?: string;
  release_date?: string;
  poster_path?: string | null;
}

export interface AuthUser {
  id: number;
  email: string;
  created_at: string;
}

export interface TokenPayload {
  access_token: string;
  token_type: string;
}

export interface WatchlistItem {
  id: number;
  movie_id: number;
  movie_title: string;
  poster_path?: string | null;
  rating?: number | null;
  watched: boolean;
  notes?: string | null;
  created_at: string;
}

export interface WatchlistRequest {
  movie_id: number;
  movie_title: string;
  poster_path?: string;
  notes?: string;
}
