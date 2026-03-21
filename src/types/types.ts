export interface Movie {
  // Уникальный интерфейс фильма
  id: number;
  name: string;
  alternativeName?: string;
  year?: number;
  rating: {
    kp?: number;
    imdb?: number;
  };
  poster?: {
    url?: string;
    previewUrl?: string;
  };
  genres?: { name: string }[];
  description?: string;
  movieLength?: number;
}

export interface APIResponse {
  // Объект из api запроса
  docs: Movie[];
  page: number;
  total: number;
  limit: number;
  pages: number;
}

export interface Filters {
  //Интерфейс для фильтрации
  genres: string[];
  ratingMin: number;
  ratingMax: number;
  yearMin: number;
  yearMax: number;
}

export const GENRES = ["аниме", "биография", "боевик", "вестерн", "документальный", "драма", "история", "комедия", "криминал", "мелодрама", "мультфильм", "музыка", "приключения", "семейный", "спорт", "триллер", "ужасы", "фантастика", "фэнтези", "эротика"];
