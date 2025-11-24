export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const POSTER_SIZE = "w342";
export const BACKDROP_SIZE = "w780";
export const PROFILE_SIZE = "w185";

export const buildImageUrl = (path?: string | null, size: string = POSTER_SIZE) => {
  if (!path) return undefined;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};
