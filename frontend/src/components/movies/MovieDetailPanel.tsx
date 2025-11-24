import Image from "next/image";
import type { MovieCredits, MovieSummary } from "@/types";
import { BACKDROP_SIZE, buildImageUrl, PROFILE_SIZE } from "@/lib/constants";
import { formatReleaseYear } from "@/lib/utils";
import { ArrowLeft, ExternalLink, Loader2, Star } from "lucide-react";

interface MovieDetailPanelProps {
  movie?: MovieSummary;
  credits?: MovieCredits;
  similar?: MovieSummary[];
  recommendations?: MovieSummary[];
  onSelectRelated?: (movieId: number) => void;
  onClose?: () => void;
  isLoading?: boolean;
}

const MovieDetailPanel = ({
  movie,
  credits,
  similar,
  recommendations,
  onSelectRelated,
  onClose,
  isLoading
}: MovieDetailPanelProps) => {
  if (!movie) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-[color:var(--border-soft)] bg-[color:var(--surface-1)] p-6 text-center text-[color:var(--text-secondary)]">
        <p className="text-sm uppercase tracking-[0.4em]">Select a movie</p>
        <p className="mt-2 text-base text-[color:var(--text-secondary)]">
          Pick a title on the left to inspect cast, embeddings, and related picks.
        </p>
      </div>
    );
  }

  const backdrop = buildImageUrl(movie.backdrop_path || movie.poster_path, BACKDROP_SIZE);
  const topCast = credits?.cast?.slice(0, 5) ?? [];
  const relatedSimilar = similar?.slice(0, 4) ?? [];
  const relatedRecommendations = recommendations?.slice(0, 4) ?? [];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] shadow-sm">
      <div className="relative h-60 w-full overflow-hidden rounded-t-2xl">
        {backdrop && (
          <Image
            src={backdrop}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width:768px) 100vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Featured</p>
            <h2 className="text-3xl font-semibold text-white">{movie.title}</h2>
            <p className="text-sm text-white/80">
              {formatReleaseYear(movie.release_date)} · TMDB Score {movie.vote_average?.toFixed(1) ?? "-"}
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs text-white/70"
            >
              <ArrowLeft className="h-4 w-4" /> Close
            </button>
          )}
        </div>
      </div>
      <div className="space-y-5 p-6 text-sm text-[color:var(--text-secondary)]">
        <p>{movie.overview || "No overview available."}</p>
        <div className="flex flex-wrap gap-3 text-xs text-[color:var(--text-secondary)]">
          {(movie.genres || []).slice(0, 4).map((genre) => (
            <span
              key={genre.id}
              className="rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-1)] px-3 py-1"
            >
              {genre.name}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-2)] p-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-[color:var(--accent)]">
            <Star className="h-5 w-5" />
            {movie.vote_average?.toFixed(1) ?? "-"}
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--text-muted)]">Audience sentiment</p>
          <a
            href={`https://www.themoviedb.org/movie/${movie.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] px-3 py-1 text-xs text-[color:var(--text-secondary)]"
          >
            View on TMDB
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-2)] px-4 py-3 text-xs text-[color:var(--text-secondary)]">
            <Loader2 className="h-4 w-4 animate-spin text-[color:var(--accent)]" />
            Syncing cast + related picks…
          </div>
        )}
        {!!topCast.length && !isLoading && (
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--text-muted)]">Top billed</p>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {topCast.map((cast) => {
                const profile = buildImageUrl(cast.profile_path, PROFILE_SIZE);
                return (
                  <div
                    key={cast.id}
                    className="flex min-w-[120px] flex-col items-center rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-2)] p-3 text-center"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[color:var(--surface-1)]">
                      {profile ? (
                        <Image src={profile} alt={cast.name} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-[color:var(--text-muted)]">
                          No photo
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[color:var(--text-primary)]">{cast.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--text-muted)]">{cast.character || "Cast"}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(relatedSimilar.length > 0 || relatedRecommendations.length > 0) && (
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--text-muted)]">Related picks</p>
            {[{ label: "Similar vibe", items: relatedSimilar }, { label: "Recommended next", items: relatedRecommendations }].map(
              ({ label, items }) =>
                items.length > 0 && (
                  <div key={label}>
                    <p className="text-[11px] uppercase tracking-[0.4em] text-[color:var(--text-muted)]">{label}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onSelectRelated?.(item.id)}
                          className="rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-1)] px-3 py-1 text-xs text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPanel;
