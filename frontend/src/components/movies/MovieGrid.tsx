import type { MovieSummary } from "@/types";
import MovieCard from "@/components/movies/MovieCard";

interface MovieGridProps {
  movies: MovieSummary[];
  onSelect?: (movie: MovieSummary) => void;
  isLoading?: boolean;
  activeMovieId?: number;
}

const MovieGrid = ({ movies, onSelect, isLoading, activeMovieId }: MovieGridProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-2xl bg-[color:var(--surface-2)]" />
        ))}
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface-1)] p-8 text-center text-[color:var(--text-secondary)]">
        No movies yet. Try a different prompt.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onSelect={onSelect} isActive={movie.id === activeMovieId} />
      ))}
    </div>
  );
};

export default MovieGrid;
