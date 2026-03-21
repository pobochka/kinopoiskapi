import { useState, useEffect, useCallback } from "react";
import { fetchMovies } from "../api/api";
import type { Movie, Filters } from "../types/types";

export function useMovies(filters: Filters) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters);

  // Сброс при смене фильтров
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [filtersKey]);

  useEffect(() => {
    if (!hasMore || loading) return;

    let cancelled = false;
    setLoading(true);

    fetchMovies({
      page,
      limit: 50,
      genres: filters.genres.length > 0 ? filters.genres : undefined,
      ratingMin: filters.ratingMin,
      ratingMax: filters.ratingMax,
      yearMin: filters.yearMin,
      yearMax: filters.yearMax,
    })
      .then((data) => {
        if (cancelled) return;
        setMovies((prev) => (page === 1 ? data.docs : [...prev, ...data.docs]));
        setHasMore(page < data.pages && data.docs.length > 0);
      })
      .catch((err) => {
        if (cancelled) return;
        setHasMore(false);
        setError(err.response?.status === 403 ? "Превышен лимит запросов. Попробуйте позже или смените API-ключ." : err.response?.status === 429 ? "Слишком много запросов. Подождите немного." : err.message || "Ошибка загрузки");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, filtersKey]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !error) setPage((p) => p + 1);
  }, [loading, hasMore, error]);

  return { movies, loading, error, hasMore, loadMore };
}
