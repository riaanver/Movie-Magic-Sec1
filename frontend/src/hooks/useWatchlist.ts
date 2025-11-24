"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addToWatchlist,
  getWatchlist,
  rateWatchlistItem,
  removeFromWatchlist,
  toggleWatchlistItem
} from "@/lib/api/watchlist";
import type { WatchlistItem, WatchlistRequest } from "@/types";
import { useAuth } from "@/providers/auth-provider";

const useWatchlistActionsInternal = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const requireToken = () => {
    if (!token) {
      throw new Error("Authentication required");
    }
    return token;
  };

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["watchlist"] });

  const add = useMutation({
    mutationFn: (payload: WatchlistRequest) => addToWatchlist(requireToken(), payload),
    onSuccess: invalidate
  });

  const remove = useMutation({
    mutationFn: (itemId: number) => removeFromWatchlist(requireToken(), itemId),
    onSuccess: invalidate
  });

  const rate = useMutation({
    mutationFn: ({ itemId, rating }: { itemId: number; rating: number }) =>
      rateWatchlistItem(requireToken(), itemId, rating),
    onSuccess: invalidate
  });

  const toggle = useMutation({
    mutationFn: ({ itemId, watched }: { itemId: number; watched: boolean }) =>
      toggleWatchlistItem(requireToken(), itemId, watched),
    onSuccess: invalidate
  });

  return { add, remove, rate, toggle, hasToken: Boolean(token), tokenAccessor: requireToken };
};

export const useWatchlist = () => {
  const actions = useWatchlistActionsInternal();

  const query = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => getWatchlist(actions.tokenAccessor()),
    enabled: actions.hasToken
  });

  return {
    ...query,
    add: actions.add,
    remove: actions.remove,
    rate: actions.rate,
    toggle: actions.toggle
  };
};

export const useWatchlistActions = () => {
  const { add, remove, rate, toggle } = useWatchlistActionsInternal();
  return { add, remove, rate, toggle };
};
