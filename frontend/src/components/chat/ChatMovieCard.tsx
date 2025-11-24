"use client";

import { useState } from "react";
import { Star, Plus, Check, Eye, EyeOff, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

interface MovieData {
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

interface ChatMovieCardProps {
  movie: MovieData;
  onMovieClick?: (movieId: number) => void;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";

export default function ChatMovieCard({ movie, onMovieClick }: ChatMovieCardProps) {
  const { user } = useAuth();
  const { add, data: watchlistItems } = useWatchlist();
  const [showThrillers, setShowThrillers] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const isInWatchlist = watchlistItems?.some((item) => item.movie_id === movie.id);
  const releaseYear = movie.release_date?.substring(0, 4);

  const handleAddToWatchlist = async () => {
    if (!user) {
      toast.error("Sign in to save movies");
      return;
    }

    try {
      await add.mutateAsync({
        movie_id: movie.id,
        movie_title: movie.title,
        poster_path: movie.poster_path || null
      });
      toast.success(`Added ${movie.title} to watchlist`);
    } catch (error) {
      toast.error("Failed to add to watchlist");
    }
  };

  return (
    <div className="my-3 rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface-2)] p-4 transition hover:border-[color:var(--border-strong)]">
      <div className="flex gap-4">
        {/* Movie Poster */}
        {movie.poster_path && (
          <div className="flex-shrink-0">
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="h-40 w-28 rounded-lg object-cover shadow-md"
            />
          </div>
        )}

        {/* Movie Info */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">
                {movie.title}
              </h3>
              {releaseYear && (
                <p className="text-sm text-[color:var(--text-secondary)]">{releaseYear}</p>
              )}
            </div>
            {movie.vote_average && (
              <div className="flex items-center gap-1 rounded-full bg-[color:var(--accent-soft)] px-2 py-1">
                <Star className="h-3 w-3 fill-[color:var(--accent)] text-[color:var(--accent)]" />
                <span className="text-sm font-semibold text-[color:var(--text-primary)]">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* AI Recommendation Reason */}
          {movie.reason && (
            <p className="mt-2 text-sm italic text-[color:var(--text-secondary)]">
              "{movie.reason}"
            </p>
          )}

          {/* Overview */}
          {movie.overview && (
            <p className="mt-2 line-clamp-2 text-sm text-[color:var(--text-secondary)]">
              {movie.overview}
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToWatchlist}
              disabled={isInWatchlist || add.isPending}
            >
              {isInWatchlist ? (
                <>
                  <Check className="mr-1 h-4 w-4" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus className="mr-1 h-4 w-4" />
                  Add to Watchlist
                </>
              )}
            </Button>

            {movie.trailer_key && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTrailer(!showTrailer)}
              >
                <Play className="mr-1 h-4 w-4" />
                {showTrailer ? "Hide" : "Watch"} Trailer
              </Button>
            )}

            {movie.thrillers && movie.thrillers.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThrillers(!showThrillers)}
              >
                <Sparkles className="mr-1 h-4 w-4" />
                {showThrillers ? "Hide" : "Show"} Thriller Picks ({movie.thrillers.length})
              </Button>
            )}
          </div>

          {/* Trailer */}
          {showTrailer && movie.trailer_key && (
            <div className="mt-3 rounded-lg overflow-hidden border border-[color:var(--border-soft)]">
              <div className="relative pb-[56.25%]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${movie.trailer_key}`}
                  title={`${movie.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Thriller Recommendations */}
          {showThrillers && movie.thrillers && movie.thrillers.length > 0 && (
            <div className="mt-3 rounded-lg border border-[color:var(--border-soft)] bg-[color:var(--surface-1)] p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
                Similar Thrillers
              </p>
              <div className="flex gap-2 overflow-x-auto">
                {movie.thrillers.map((thriller) => (
                  <button
                    key={thriller.id}
                    onClick={() => onMovieClick?.(thriller.id)}
                    className="flex-shrink-0 text-left transition hover:opacity-80"
                  >
                    {thriller.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${thriller.poster_path}`}
                        alt={thriller.title}
                        className="h-24 w-16 rounded object-cover shadow-sm"
                        title={thriller.title}
                      />
                    ) : (
                      <div className="flex h-24 w-16 items-center justify-center rounded bg-[color:var(--surface-3)] text-xs text-[color:var(--text-muted)]">
                        {thriller.title}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
