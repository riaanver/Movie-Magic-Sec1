"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getMovieCredits,
  getMovieDetails,
  getMovieRecommendations,
  getPopularMovies,
  getSimilarMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  semanticSearchMovies
} from "@/lib/api/movies";

const feedFetcher = {
  popular: getPopularMovies,
  "top-rated": getTopRatedMovies,
  upcoming: getUpcomingMovies
};

export type MovieFeed = keyof typeof feedFetcher;

export const useMovieFeed = (feed: MovieFeed, page = 1) =>
  useQuery({
    queryKey: ["movies", "feed", feed, page],
    queryFn: () => feedFetcher[feed](page)
  });

export const useMovieSearch = (query: string) =>
  useQuery({
    queryKey: ["movies", "search", query],
    queryFn: () => searchMovies(query),
    enabled: query.length > 2
  });

export const useSemanticSearch = () =>
  useMutation({
    mutationFn: semanticSearchMovies
  });

export const useMovieDetails = (movieId?: number) =>
  useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetails(movieId!),
    enabled: Boolean(movieId)
  });

export const useMovieCredits = (movieId?: number) =>
  useQuery({
    queryKey: ["movies", "credits", movieId],
    queryFn: () => getMovieCredits(movieId!),
    enabled: Boolean(movieId)
  });

export const useSimilarMovies = (movieId?: number) =>
  useQuery({
    queryKey: ["movies", "similar", movieId],
    queryFn: () => getSimilarMovies(movieId!),
    enabled: Boolean(movieId)
  });

export const useMovieRecommendations = (movieId?: number) =>
  useQuery({
    queryKey: ["movies", "recommendations", movieId],
    queryFn: () => getMovieRecommendations(movieId!),
    enabled: Boolean(movieId)
  });
