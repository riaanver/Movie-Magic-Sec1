import React from 'react';
import { Star, Calendar, MapPin, Film, ExternalLink } from 'lucide-react';

const MovieDetail = ({ movie }) => {
  if (!movie) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl glass-effect-strong animate-fadeIn">
      {/* Backdrop */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={movie.backdrop_path} 
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = movie.poster_path;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent"></div>
        
        {/* Floating rating */}
        <div className="absolute top-4 right-4 px-3 py-2 rounded-full glass-effect-strong flex items-center gap-2">
          <Star className="w-5 h-5 text-accent fill-accent" />
          <div>
            <div className="text-lg font-bold text-text-main">{movie.vote_average?.toFixed(1)}</div>
            <div className="text-xs text-text-secondary">{movie.vote_count?.toLocaleString()} votes</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Title & Tagline */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-text-main mb-1">{movie.title}</h2>
          {movie.tagline && (
            <p className="text-sm text-accent italic">"{movie.tagline}"</p>
          )}
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {movie.release_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-accent" />
              <div>
                <div className="text-text-secondary text-xs">Release Date</div>
                <div className="text-text-main font-medium">
                  {new Date(movie.release_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          )}
          {movie.runtime && (
            <div className="flex items-center gap-2 text-sm">
              <Film className="w-4 h-4 text-accent" />
              <div>
                <div className="text-text-secondary text-xs">Runtime</div>
                <div className="text-text-main font-medium">{movie.runtime} minutes</div>
              </div>
            </div>
          )}
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 text-sm rounded-full bg-accent/20 border border-accent/30 text-accent font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text-main mb-2">Overview</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{movie.overview}</p>
        </div>

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-text-main mb-3">Cast</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {movie.cast.map((actor, idx) => (
                <div key={idx} className="flex-shrink-0 text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-accent/30 hover:border-accent transition-colors duration-300">
                    <img 
                      src={actor.profile_path || 'https://via.placeholder.com/185/1E1E1E/00E5FF?text=?'} 
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs text-text-main font-medium w-20 truncate">{actor.name}</div>
                  <div className="text-xs text-text-secondary w-20 truncate">{actor.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Director */}
        {movie.director && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-text-main mb-1">Director</h3>
            <p className="text-sm text-accent">{movie.director}</p>
          </div>
        )}

        {/* Streaming Platforms */}
        {movie.platforms && movie.platforms.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-text-main mb-2">Watch on</h3>
            <div className="flex flex-wrap gap-2">
              {movie.platforms.map((platform, idx) => (
                <button
                  key={idx}
                  className="px-3 py-1.5 text-sm rounded-lg glass-effect hover:glass-effect-strong border border-white/10 hover:border-accent/50 text-text-main hover:text-accent transition-all duration-300 flex items-center gap-2"
                >
                  {platform}
                  <ExternalLink className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trivia */}
        {movie.trivia && (
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="text-xs font-semibold text-accent mb-1">💡 Fun Fact</div>
            <p className="text-xs text-text-secondary">{movie.trivia}</p>
          </div>
        )}

        {/* Budget & Revenue */}
        {(movie.budget || movie.revenue) && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
            {movie.budget && (
              <div>
                <div className="text-xs text-text-secondary mb-1">Budget</div>
                <div className="text-sm font-semibold text-text-main">
                  ${(movie.budget / 1000000).toFixed(1)}M
                </div>
              </div>
            )}
            {movie.revenue && (
              <div>
                <div className="text-xs text-text-secondary mb-1">Box Office</div>
                <div className="text-sm font-semibold text-accent">
                  ${(movie.revenue / 1000000).toFixed(1)}M
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
