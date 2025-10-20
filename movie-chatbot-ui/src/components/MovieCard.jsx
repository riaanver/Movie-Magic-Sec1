import React from 'react';
import { Star, Calendar, Clock, Plus, Info, Play, Bookmark } from 'lucide-react';

const MovieCard = ({ movie, isExpanded = false }) => {
  if (!movie) return null;

  return (
    <div className="group relative overflow-hidden rounded-2xl glass-effect hover:glass-effect-strong transition-all duration-300 hover:scale-[1.02] animate-fadeIn">
      {/* Backdrop glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
        <img 
          src={movie.backdrop_path || movie.poster_path} 
          alt=""
          className="w-full h-full object-cover blur-xl"
        />
      </div>

      <div className="relative p-4">
        <div className="flex gap-4">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-36 rounded-lg overflow-hidden group-hover:shadow-2xl transition-shadow duration-300">
              <img 
                src={movie.poster_path} 
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/1E1E1E/00E5FF?text=No+Poster';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Play className="w-8 h-8 text-accent" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-lg text-text-main line-clamp-1 group-hover:text-accent transition-colors duration-300">
                {movie.title}
              </h3>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 border border-accent/30 flex-shrink-0">
                <Star className="w-3 h-3 text-accent fill-accent" />
                <span className="text-xs font-semibold text-accent">{movie.vote_average?.toFixed(1)}</span>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-text-secondary">
              {movie.release_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{movie.runtime}min</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {movie.genres.slice(0, 3).map((genre, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-0.5 text-xs rounded-full bg-primary/60 border border-white/10 text-text-secondary hover:border-accent/50 hover:text-accent transition-all duration-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-sm text-text-secondary line-clamp-2 mb-3 leading-relaxed">
              {movie.overview}
            </p>

            {/* AI Explanation */}
            {movie.explanation && (
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 mb-3">
                <p className="text-xs text-accent italic">
                  ✨ {movie.explanation}
                </p>
              </div>
            )}

            {/* Director & Cast */}
            {(movie.director || movie.cast) && (
              <div className="text-xs text-text-secondary mb-3 space-y-1">
                {movie.director && (
                  <div>
                    <span className="text-text-main font-semibold">Director:</span> {movie.director}
                  </div>
                )}
                {movie.cast && movie.cast.length > 0 && (
                  <div>
                    <span className="text-text-main font-semibold">Cast:</span> {movie.cast.slice(0, 3).join(', ')}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 rounded-lg bg-accent/20 hover:bg-accent hover:text-background text-accent border border-accent/30 hover:border-accent transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium group/btn">
                <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                <span>Watchlist</span>
              </button>
              <button className="px-3 py-2 rounded-lg glass-effect hover:glass-effect-strong border-white/10 hover:border-accent/50 transition-all duration-300 flex items-center justify-center group/btn">
                <Info className="w-4 h-4 text-text-secondary group-hover/btn:text-accent transition-colors duration-300" />
              </button>
              <button className="px-3 py-2 rounded-lg glass-effect hover:glass-effect-strong border-white/10 hover:border-accent/50 transition-all duration-300 flex items-center justify-center group/btn">
                <Bookmark className="w-4 h-4 text-text-secondary group-hover/btn:text-accent transition-colors duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
