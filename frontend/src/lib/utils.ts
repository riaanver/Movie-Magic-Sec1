import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatReleaseYear = (date?: string | null) => {
  if (!date) return "N/A";
  return new Date(date).getFullYear();
};

export const formatRating = (rating?: number | null) => {
  if (rating === undefined || rating === null) {
    return "-";
  }
  return rating.toFixed(1);
};

export const formatRuntime = (minutes?: number | null) => {
  if (!minutes) return "Unknown runtime";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins}m`;
  return `${hours}h ${mins}m`;
};

export const formatRelativeTime = (dateInput?: string | number | Date | null) => {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();
  if (Number.isNaN(diffMs)) return "-";

  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
