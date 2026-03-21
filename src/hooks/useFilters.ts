import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Filters } from "../types/types";

const CURRENT_YEAR = new Date().getFullYear();

function parseFiltersFromParams(params: URLSearchParams): Filters {
  return {
    genres: params.get("genres")?.split(",").filter(Boolean) ?? [],
    ratingMin: Number(params.get("ratingMin") ?? 0),
    ratingMax: Number(params.get("ratingMax") ?? 10),
    yearMin: Number(params.get("yearMin") ?? 1990),
    yearMax: Number(params.get("yearMax") ?? CURRENT_YEAR),
  };
}

function filtersToParams(filters: Filters): Record<string, string> {
  const p: Record<string, string> = {};
  if (filters.genres.length) p.genres = filters.genres.join(",");
  if (filters.ratingMin !== 0) p.ratingMin = String(filters.ratingMin);
  if (filters.ratingMax !== 10) p.ratingMax = String(filters.ratingMax);
  if (filters.yearMin !== 1990) p.yearMin = String(filters.yearMin);
  if (filters.yearMax !== CURRENT_YEAR) p.yearMax = String(filters.yearMax);
  return p;
}

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseFiltersFromParams(searchParams);

  const setFilters = useCallback(
    (next: Filters) => {
      setSearchParams(filtersToParams(next), { replace: true });
    },
    [setSearchParams]
  );

  return { filters, setFilters };
}
