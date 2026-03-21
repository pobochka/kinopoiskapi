import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Movie } from "../../types/types";
import { useCompareCtx, useFavoritesCtx } from "../../store/store";
import { fetchMovieById } from "../../api/api";
import { Modal } from "../../components/Modal/Modal";
import "./MovieDetailPage.css";

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { isFavorite, addFavorite, removeFavorite } = useFavoritesCtx();
  const { isInCompare, toggleCompare } = useCompareCtx();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchMovieById(Number(id))
      .then(setMovie)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner" />
        <span>Загрузка...</span>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="detail-error">
        <p>Ошибка загрузки: {error}</p>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← Назад
        </button>
      </div>
    );
  }

  const fav = isFavorite(movie.id);
  const cmp = isInCompare(movie.id);
  const rating = movie.rating?.kp?.toFixed(1) ?? "-";
  const ratingClass = !movie.rating?.kp ? "" : movie.rating.kp >= 7 ? "good" : movie.rating.kp >= 5 ? "mid" : "bad";

  return (
    <>
      <div className="detail-page">
        {movie.poster?.url && (
          <div className="detail-backdrop">
            <img src={movie.poster.url} alt="" aria-hidden />
          </div>
        )}

        <div className="detail-inner">
          <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}>
            ← Назад
          </button>

          <div className="detail-content">
            <div className="detail-poster">{movie.poster?.url ? <img src={movie.poster.url} alt={movie.name} /> : <div className="no-poster">⚅</div>}</div>

            <div className="detail-info">
              <h1 className="detail-title">{movie.name || movie.alternativeName || "Без названия"}</h1>
              {movie.alternativeName && movie.name && <p className="detail-alt-name">{movie.alternativeName}</p>}

              <div className="detail-meta">
                <span className={`detail-rating ${ratingClass}`}>★ {rating}</span>
                {movie.rating?.imdb && <span className="detail-imdb">IMDB {movie.rating.imdb.toFixed(1)}</span>}
                {movie.year && <span className="detail-chip">{movie.year}</span>}
                {movie.movieLength && <span className="detail-chip">{movie.movieLength} мин</span>}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="detail-genres">
                  {movie.genres.map((g) => (
                    <span key={g.name} className="genre-badge">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.description && <p className="detail-desc">{movie.description}</p>}

              <div className="detail-actions">
                <button className={`btn ${fav ? "btn-accent" : "btn-ghost"}`} onClick={() => (fav ? removeFavorite(movie.id) : setShowConfirm(true))}>
                  {fav ? "★ В избранном" : "☆ В избранное"}
                </button>
                <button className={`btn ${cmp ? "btn-accent" : "btn-ghost"}`} onClick={() => toggleCompare(movie)}>
                  ⇄ {cmp ? "В сравнении" : "Сравнить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <Modal title="Добавить в избранное?" onClose={() => setShowConfirm(false)}>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>
            Добавить <strong style={{ color: "var(--text)" }}>{movie.name}</strong> В избранное?
          </p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>
              Отмена
            </button>
            <button
              className="btn btn-accent"
              onClick={() => {
                addFavorite(movie);
                setShowConfirm(false);
              }}
            >
              Добавить
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
