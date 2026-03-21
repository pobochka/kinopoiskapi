import { useCompareCtx } from "../../store/store";
import "./CompareBar.css";

function ratingClass(r?: number) {
  if (!r) return "";
  return r >= 7 ? "good" : r >= 5 ? "mid" : "bad";
}

export function CompareBar() {
  const { compareList, clearCompare, toggleCompare } = useCompareCtx();
  if (compareList.length === 0) return null;

  const [a, b] = compareList;

  return (
    <div className="compare-bar">
      <div className="compare-bar-inner">
        <span className="compare-label">Сравнение</span>

        <div className="compare-films">
          {compareList.map((m) => (
            <div key={m.id} className="compare-film-chip">
              {m.poster?.previewUrl && <img src={m.poster.previewUrl} alt="" />}
              <span>{m.name}</span>
              <button onClick={() => toggleCompare(m)}>✕</button>
            </div>
          ))}
        </div>

        {compareList.length === 2 && (
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Параметр</th>
                  <th>{a.name}</th>
                  <th>{b.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Год</td>
                  <td>{a.year ?? "-"}</td>
                  <td>{b.year ?? "-"}</td>
                </tr>
                <tr>
                  <td>Рейтинг kp</td>
                  <td className={ratingClass(a.rating?.kp)}>{a.rating?.kp?.toFixed(1) ?? "-"}</td>
                  <td className={ratingClass(b.rating?.kp)}>{b.rating?.kp?.toFixed(1) ?? "-"}</td>
                </tr>
                <tr>
                  <td>Жанры</td>
                  <td>{a.genres?.map((g) => g.name).join(", ") || "-"}</td>
                  <td>{b.genres?.map((g) => g.name).join(", ") || "-"}</td>
                </tr>
                <tr>
                  <td>Длительность</td>
                  <td>{a.movieLength ? `${a.movieLength} мин` : "-"}</td>
                  <td>{b.movieLength ? `${b.movieLength} мин` : "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <button className="btn btn-ghost compare-clear" onClick={clearCompare}>
          Закрыть
        </button>
      </div>
    </div>
  );
}
