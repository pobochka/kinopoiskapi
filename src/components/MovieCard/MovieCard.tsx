import { useNavigate } from "react-router-dom";
import type { Movie } from "../../types/types";
import { useCompareCtx, useFavoritesCtx } from "../../store/store";
import { useState } from "react";
import { Modal } from "../Modal/Modal";
import "./MovieCard.css";

interface Props {
  movie: Movie;
}

export function MovieCard({ movie }: Props) {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesCtx();
  const { isInCompare, toggleCompare } = useCompareCtx();
  const [showConfirm, setShowConfirm] = useState(false);

  const fav = isFavorite(movie.id);
  const cmp = isInCompare(movie.id);
  const rating = movie.rating?.kp?.toFixed(1) ?? "No rating";
  const ratingClass = !movie.rating?.kp ? "" : movie.rating.kp >= 7 ? "good" : movie.rating.kp >= 5 ? "mid" : "bad";

  function handleFavClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (fav) {
      removeFavorite(movie.id);
      return;
    }
    setShowConfirm(true);
  }

  function handleCmpClick(e: React.MouseEvent) {
    e.stopPropagation();
    toggleCompare(movie);
  }

  return (
    <>
      <div className="card" onClick={() => navigate(`/movie/${movie.id}`)}>
        <div className="card-poster">
          {movie.poster?.previewUrl ? (
            <img src={movie.poster.previewUrl} alt={movie.name} loading="lazy" />
          ) : (
            <svg className="card-no-poster" width="800px" height="800px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 1H1V7H3.38197L4.88196 4L7.11803 4L10 9.76393L11.382 7H15V1Z" fill="#000000" />
              <path d="M15 9H12.618L11.118 12L8.88197 12L6 6.23607L4.61803 9H1V15H15V9Z" fill="#000000" />
            </svg>
          )}
          <div className="card-rating" data-class={ratingClass}>
            {rating}
          </div>
        </div>
        <div className="card-body">
          <p className="card-title">{movie.name || movie.alternativeName || "Нет названия"}</p>
          <p className="card-year">{movie.year ?? "No year"}</p>
          {movie.genres && movie.genres.length > 0 && (
            <p className="card-genres">
              {movie.genres
                .slice(0, 2)
                .map((g) => g.name)
                .join(", ")}
            </p>
          )}
        </div>
        <div className="card-actions">
          <button className={`card-btn fav-btn ${fav ? "active" : ""}`} onClick={handleFavClick} title={fav ? "Убрать из избранного" : "В избранное"}>
            {fav ? "★" : "☆"}
          </button>
          <button className={`card-btn cmp-btn ${cmp ? "active" : ""}`} onClick={handleCmpClick} title={cmp ? "Убрать из сравнения" : "Сравнить"}>
            ⇄
          </button>
        </div>
      </div>

      {showConfirm && (
        <Modal title="Добавить в избранное?" onClose={() => setShowConfirm(false)}>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>
            Добавить <strong style={{ color: "var(--text)" }}>{movie.name}</strong> в список избранного?
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
