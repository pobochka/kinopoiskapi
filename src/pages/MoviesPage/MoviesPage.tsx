import { useEffect, useRef, useState } from "react";
import { useFilters } from "../../hooks/useFilters";
import { useMovies } from "../../hooks/useMovies";
import { FiltersPanel } from "../../components/FiltersPanel/FiltersPanel";
import { MovieCard } from "../../components/MovieCard/MovieCard";
import "./MoviesPage.css";

export function MoviesPage() {
  const { filters, setFilters } = useFilters();
  const { movies, loading, error, hasMore, loadMore } = useMovies(filters);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  //Бесконечный скролл
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div className="movies-page">
      <div className="movies-page-inner">
        <button className="filters-toggle btn btn-ghost" onClick={() => setFiltersOpen((o) => !o)}>
          {filtersOpen ? "✕ Скрыть фильтры" : "⚙ Фильтры"}
        </button>

        <div className={`movies-layout ${filtersOpen ? "with-filters" : ""}`}>
          {filtersOpen && <FiltersPanel filters={filters} onChange={setFilters} />}
          <div className="movies-main">
            {error && <div className="error-banner">Ошибка: {error}</div>}

            {movies.length === 0 && !loading && !error && (
              <div className="empty-state">
                <p>Фильмы не найдены. Попробуйте изменить фильтры.</p>
              </div>
            )}

            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {loading && (
              <div className="loading-row">
                <div className="spinner" />
                <span>Загрузка фильмов</span>
              </div>
            )}

            <div ref={sentinelRef} className="sentinel" />

            {!hasMore && movies.length > 0 && <p className="end-message">Фильмы загружены</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
