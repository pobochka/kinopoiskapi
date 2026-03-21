import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FavoritesContext, CompareContext, useFavorites, useCompare } from "./store/store";
import { Navbar } from "./components/Navbar/Navbar";
import { MoviesPage } from "./pages/MoviesPage/MoviesPage";
import { MovieDetailPage } from "./pages/MovieDetailPage/MovieDetailPage";
import { CompareBar } from "./components/CompareBar/CompareBar";
import { FavoritesPage } from "./pages/FavoritesPage/FavoritesPage";

function AppProviders({ children }: { children: React.ReactNode }) {
  const fav = useFavorites();
  const cmp = useCompare();
  return (
    <FavoritesContext.Provider value={fav}>
      <CompareContext.Provider value={cmp}>{children}</CompareContext.Provider>
    </FavoritesContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Navbar />
        <Routes>
          <Route path="/" element={<MoviesPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
        <CompareBar />
      </AppProviders>
    </BrowserRouter>
  );
}
