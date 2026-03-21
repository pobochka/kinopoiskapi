import axios from "axios";
import type { APIResponse, Movie } from "../types/types";

const API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY || "";
const CURRENT_YEAR = new Date().getFullYear();

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  config.params = { ...config.params, token: API_KEY };
  return config;
});

export interface FetchMoviesParams {
  page?: number;
  limit?: number;
  genres?: string[];
  ratingMin?: number;
  ratingMax?: number;
  yearMin?: number;
  yearMax?: number;
}

export async function fetchMovies(params: FetchMoviesParams): Promise<APIResponse> {
  const query: Record<string, string | number | string[]> = {
    page: params.page || 1,
    limit: params.limit || 50,
    notNullFields: "name",
  };

  if (params.genres && params.genres.length > 0) {
    query["genres.name"] = params.genres;
  }

  const rMin = params.ratingMin ?? 0;
  const rMax = params.ratingMax ?? 10;
  if (rMin !== 0 || rMax !== 10) {
    query["rating.kp"] = `${rMin}-${rMax}`;
  }

  const yMin = params.yearMin ?? 1990;
  const yMax = params.yearMax ?? CURRENT_YEAR;
  if (yMin !== 1990 || yMax !== CURRENT_YEAR) {
    query["year"] = `${yMin}-${yMax}`;
  }

  const response = await api.get<APIResponse>("/v1.4/movie", { params: query });
  return response.data;
}

export async function fetchMovieById(id: number): Promise<Movie> {
  const response = await api.get<Movie>(`/v1.4/movie/${id}`);
  return response.data;
}
