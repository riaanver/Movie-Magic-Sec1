import apiClient from "@/lib/api-client";
import type { WatchlistItem, WatchlistRequest } from "@/types";

export const getWatchlist = async (token: string): Promise<WatchlistItem[]> => {
  const { data } = await apiClient.get<WatchlistItem[]>("/watchlist", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const addToWatchlist = async (token: string, payload: WatchlistRequest): Promise<WatchlistItem> => {
  const { data } = await apiClient.post<WatchlistItem>("/watchlist", payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const removeFromWatchlist = async (token: string, itemId: number): Promise<void> => {
  await apiClient.delete(`/watchlist/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const rateWatchlistItem = async (
  token: string,
  itemId: number,
  rating: number
): Promise<WatchlistItem> => {
  const { data } = await apiClient.patch<WatchlistItem>(
    `/watchlist/${itemId}/rating`,
    { rating },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const toggleWatchlistItem = async (
  token: string,
  itemId: number,
  watched: boolean
): Promise<WatchlistItem> => {
  const { data } = await apiClient.patch<WatchlistItem>(
    `/watchlist/${itemId}/watched`,
    { watched },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
