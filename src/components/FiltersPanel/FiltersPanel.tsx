import { GENRES, type Filters } from "../../types/types";
import "./FiltersPanel.css";

const CURRENT_YEAR = new Date().getFullYear();

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export function FiltersPanel({ filters, onChange }: Props) {
  //Обновление жанров
  function toggleGenre(genre: string) {
    const genres = filters.genres.includes(genre) ? filters.genres.filter((g) => g !== genre) : [...filters.genres, genre];
    onChange({ ...filters, genres });
  }

  return (
    <aside className="filters-panel">
      <h2 className="filters-title">Фильтры</h2>

      <section className="filter-section">
        <h3>Жанры</h3>
        <div className="genre-grid">
          {GENRES.map((g) => (
            <button key={g} className={`genre-chip ${filters.genres.includes(g) ? "active" : ""}`} onClick={() => toggleGenre(g)}>
              {g}
            </button>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <h3>
          Рейтинг: {filters.ratingMin} - {filters.ratingMax}
        </h3>
        <div className="range-row">
          <span>0</span>
          <input type="range" min={0} max={10} step={0.5} value={filters.ratingMin} onChange={(e) => onChange({ ...filters, ratingMin: +e.target.value })} />
          <input type="range" min={0} max={10} step={0.5} value={filters.ratingMax} onChange={(e) => onChange({ ...filters, ratingMax: +e.target.value })} />
          <span>10</span>
        </div>
      </section>

      <section className="filter-section">
        <h3>
          Год: {filters.yearMin} - {filters.yearMax}
        </h3>
        <div className="range-row">
          <span>1990</span>
          <input type="range" min={1990} max={CURRENT_YEAR} value={filters.yearMin} onChange={(e) => onChange({ ...filters, yearMin: +e.target.value })} />
          <input type="range" min={1990} max={CURRENT_YEAR} value={filters.yearMax} onChange={(e) => onChange({ ...filters, yearMax: +e.target.value })} />
          <span>{CURRENT_YEAR}</span>
        </div>
      </section>

      <button
        className="btn btn-ghost reset-btn"
        onClick={() =>
          onChange({
            genres: [],
            ratingMin: 0,
            ratingMax: 10,
            yearMin: 1990,
            yearMax: CURRENT_YEAR,
          })
        }
      >
        Сбросить фильтры
      </button>
    </aside>
  );
}
