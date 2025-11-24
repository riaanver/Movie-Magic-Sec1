"use client";

import clsx from "clsx";
import Image from "next/image";
import { BookmarkPlus, CalendarDays, ExternalLink, Star } from "lucide-react";
import { toast } from "sonner";

import type { MovieSummary } from "@/types";
import { buildImageUrl } from "@/lib/constants";
import { formatReleaseYear } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useWatchlistActions } from "@/hooks/useWatchlist";

interface MovieCardProps {
  movie: MovieSummary;
  onSelect?: (movie: MovieSummary) => void;
  isActive?: boolean;
}

const MovieCard = ({ movie, onSelect, isActive }: MovieCardProps) => {
  const posterUrl = buildImageUrl(movie.poster_path);
  const { user } = useAuth();
  const { add } = useWatchlistActions();

  const handleWatchlist = async () => {
    if (!user) {
      toast("Sign in to save movies");
      return;
    }
    await add.mutateAsync({
      movie_id: movie.id,
      movie_title: movie.title,
      poster_path: movie.poster_path ?? undefined
    });
    toast.success("Added to watchlist");
  };

  return (
    <div
      className={clsx(
        "group flex gap-4 rounded-2xl border bg-[color:var(--surface-1)] p-4 shadow-sm transition",
        isActive
          ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]"
          : "border-[color:var(--border-soft)] hover:border-[color:var(--border-strong)]"
      )}
    >
      <div className="relative h-36 w-24 overflow-hidden rounded-xl bg-[color:var(--surface-2)]">
        {posterUrl ? (
          <Image src={posterUrl} alt={movie.title} fill className="object-cover" sizes="112px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[color:var(--text-muted)]">
            No art
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full border border-white/10 bg-black/60 px-2 py-1 text-[10px] uppercase tracking-[0.4em] text-white/60">
          {formatReleaseYear(movie.release_date)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{movie.title}</h3>
            <p className="text-xs text-[color:var(--text-secondary)] line-clamp-1">{movie.overview || "No overview available."}</p>
          </div>
          <div className="rounded-2xl border border-[color:var(--border-soft)] px-3 py-2 text-right text-sm text-[color:var(--text-secondary)]">
            <p className="flex items-center gap-1 text-base font-semibold text-[color:var(--accent)]">
              <Star className="h-4 w-4" />
              {movie.vote_average?.toFixed(1) ?? "-"}
            </p>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[color:var(--text-muted)]">TMDB</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-[color:var(--text-secondary)]">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-3 w-3" /> {movie.release_date ?? "--"}
          </span>
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.4em] text-white/50">
            #{movie.id}
          </span>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onSelect?.(movie)}>
            Focus
          </Button>
          <Button variant="outline" size="sm" onClick={handleWatchlist} disabled={add.isPending}>
            <BookmarkPlus className="mr-1 h-3.5 w-3.5" />
            Watchlist
          </Button>
          <a
            href={`https://www.themoviedb.org/movie/${movie.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border-soft)] px-4 py-2 text-xs text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
          >
            TMDB
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
