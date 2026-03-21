import { useLocation, Link } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">❦</span>
          <span className="logo-text">Лента</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Каталог
          </Link>
          <Link to="/favorites" className={`nav-link ${pathname === "/favorites" ? "active" : ""}`}>
            Избранное
          </Link>
        </div>
      </div>
    </nav>
  );
}
