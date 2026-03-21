import { createContext, useCallback, useContext, useState } from "react";
import type { Movie } from "../types/types";

const FAVORITES_KEY = "kino_favorites";

function loadFavorites(): Movie[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(movies: Movie[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(movies));
}

//хук для хранения информации об избранном
export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>(loadFavorites);

  const addFavorite = useCallback((movie: Movie) => {
    setFavorites((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      const next = [...prev, movie];
      saveFavorites(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = prev.filter((m) => m.id !== id);
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: number) => favorites.some((m) => m.id === id), [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}

//хук для хранения сравнений
export function useCompare() {
  const [compareList, setCompareList] = useState<Movie[]>([]);

  const toggleCompare = useCallback((movie: Movie) => {
    setCompareList((prev) => {
      if (prev.find((m) => m.id === movie.id)) {
        return prev.filter((m) => m.id !== movie.id);
      }
      if (prev.length >= 2) {
        return [...prev, movie];
      }

      return [...prev, movie];
    });
  }, []);

  const isInCompare = useCallback((id: number) => compareList.some((m) => m.id === id), [compareList]);
  const clearCompare = useCallback(() => setCompareList([]), []);

  return { compareList, toggleCompare, isInCompare, clearCompare };
}

interface FavCtx {
  favorites: Movie[];
  addFavorite: (m: Movie) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

interface CmpCtx {
  compareList: Movie[];
  toggleCompare: (m: Movie) => void;
  isInCompare: (id: number) => boolean;
  clearCompare: () => void;
}

export const FavoritesContext = createContext<FavCtx | null>(null);
export const CompareContext = createContext<CmpCtx | null>(null);

export function useFavoritesCtx() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("There is no FavoritesContext");
  return ctx;
}

export function useCompareCtx() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("There is no CompareContext");
  return ctx;
}
