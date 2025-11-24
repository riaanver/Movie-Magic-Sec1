"use client";

import { create } from "zustand";

interface FilterState {
  genre?: number;
  year?: string;
  minRating?: number;
  setGenre: (genre?: number) => void;
  setYear: (year?: string) => void;
  setMinRating: (rating?: number) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  genre: undefined,
  year: undefined,
  minRating: undefined,
  setGenre: (genre) => set({ genre }),
  setYear: (year) => set({ year }),
  setMinRating: (minRating) => set({ minRating }),
  reset: () => set({ genre: undefined, year: undefined, minRating: undefined })
}));
