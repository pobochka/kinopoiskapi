import { MovieCard } from "../../components/MovieCard/MovieCard";
import { useFavoritesCtx } from "../../store/store";
import "./FavoritesPage.css";

function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10,
    mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

export function FavoritesPage() {
  const { favorites } = useFavoritesCtx();

  return (
    <div className="fav-page">
      <div className="fav-inner">
        <h1 className="fav-title">Избранное</h1>
        <p className="fav-count">{favorites.length === 0 ? "Список пуст" : `${favorites.length} ${plural(favorites.length, "фильм", "фильма", "фильмов")}`}</p>

        {favorites.length === 0 ? (
          <div className="fav-empty">
            <span>★</span>
            <p>Добавить фильм в избранное, нажав на ★ в карточке</p>
          </div>
        ) : (
          <div className="fav-grid">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
