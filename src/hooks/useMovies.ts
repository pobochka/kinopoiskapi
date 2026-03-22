import { useState, useEffect, useCallback, useRef } from "react";
import { fetchMovies } from "../api/api";
import type { Movie, Filters } from "../types/types";

export function useMovies(filters: Filters) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters);
  const prevFiltersKey = useRef(filtersKey);
  const prevPage = useRef(page);

  useEffect(() => {
    let cancelled = false;

    const filtersChanged = prevFiltersKey.current !== filtersKey;
    if (filtersChanged) {
      prevFiltersKey.current = filtersKey;
      prevPage.current = 1;
      setMovies([]);
      setPage(1);
      setHasMore(true);
      setError(null);
    }

    const currentPage = filtersChanged ? 1 : page;

    setLoading(true);

    fetchMovies({
      page: currentPage,
      limit: 50,
      genres: filters.genres.length > 0 ? filters.genres : undefined,
      ratingMin: filters.ratingMin,
      ratingMax: filters.ratingMax,
      yearMin: filters.yearMin,
      yearMax: filters.yearMax,
    })
      .then((data) => {
        if (cancelled) return;
        setMovies((prev) => (currentPage === 1 ? data.docs : [...prev, ...data.docs]));
        setHasMore(currentPage < data.pages && data.docs.length > 0);
      })
      .catch((err) => {
        if (cancelled) return;
        setHasMore(false);
        if (err.response?.status === 403) {
          setError("Превышен лимит запросов. Попробуйте позже.");
        } else if (err.response?.status === 429) {
          setError("Слишком много запросов. Подождите.");
        } else {
          setError(err.message || "Ошибка загрузки");
        }
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
