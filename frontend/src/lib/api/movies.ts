import apiClient from "@/lib/api-client";
import type {
  PaginatedMovieResponse,
  SemanticSearchPayload,
  SemanticSearchResponse,
  MovieSummary,
  MovieCredits
} from "@/types";

export const getPopularMovies = async (page = 1): Promise<PaginatedMovieResponse> => {
  const { data } = await apiClient.get<PaginatedMovieResponse>("/movies/popular", {
    params: { page }
  });
  return data;
};

export const searchMovies = async (query: string, page = 1): Promise<PaginatedMovieResponse> => {
  const { data } = await apiClient.get<PaginatedMovieResponse>("/movies/search", {
    params: { query, page }
  });
  return data;
};

export const getTopRatedMovies = async (page = 1): Promise<PaginatedMovieResponse> => {
  const { data } = await apiClient.get<PaginatedMovieResponse>("/movies/top-rated", {
    params: { page }
  });
  return data;
};

export const getUpcomingMovies = async (page = 1): Promise<PaginatedMovieResponse> => {
  const { data } = await apiClient.get<PaginatedMovieResponse>("/movies/upcoming", {
    params: { page }
  });
  return data;
};

export const semanticSearchMovies = async (
  payload: SemanticSearchPayload
): Promise<SemanticSearchResponse> => {
  const { data } = await apiClient.post<SemanticSearchResponse>("/movies/semantic-search", payload);
  return data;
};

export const getMovieDetails = async (movieId: number): Promise<MovieSummary> => {
  const { data } = await apiClient.get<MovieSummary>(`/movies/${movieId}`);
  return data;
};

export const getSimilarMovies = async (
  movieId: number,
  page = 1
): Promise<PaginatedMovieResponse> => {
  const { data } = await apiClient.get<PaginatedMovieResponse>(
    `/movies/${movieId}/similar`,
    { params: { page } }
  );
  return data;
};

export const getMovieRecommendations = async (
  movieId: number,
  page = 1
): Promise<PaginatedMovieResponse> => {
  const { data } = await apiClient.get<PaginatedMovieResponse>(
    `/movies/${movieId}/recommendations`,
    { params: { page } }
  );
  return data;
};

export const getMovieCredits = async (movieId: number): Promise<MovieCredits> => {
  const { data } = await apiClient.get<MovieCredits>(`/movies/${movieId}/credits`);
  return data;
};
