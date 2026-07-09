import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type {
  AppAreaSummary,
  CategorySummary,
  Project,
  ProjectFilters,
  ProjectsResponse,
  Stats,
} from "./types";

const LONG = 5 * 60_000;

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<CategorySummary[]>("/categories"),
    staleTime: LONG,
  });
}

export function useApplicationAreas() {
  return useQuery({
    queryKey: ["application-areas"],
    queryFn: () => apiFetch<AppAreaSummary[]>("/application-areas"),
    staleTime: LONG,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => apiFetch<Stats>("/stats"),
    staleTime: LONG,
  });
}

export function filtersToQuery(f: ProjectFilters): string {
  const p = new URLSearchParams();
  if (f.search) p.set("search", f.search);
  if (f.category) p.set("category", f.category);
  if (f.applicationArea) p.set("applicationArea", f.applicationArea);
  if (f.tier) p.set("tier", f.tier);
  if (f.complexity) p.set("complexity", f.complexity);
  if (f.minPrice != null) p.set("minPrice", String(f.minPrice));
  if (f.maxPrice != null) p.set("maxPrice", String(f.maxPrice));
  if (f.sort && f.sort !== "importance") p.set("sort", f.sort);
  if (f.page && f.page > 1) p.set("page", String(f.page));
  if (f.perPage) p.set("perPage", String(f.perPage));
  return p.toString();
}

export function useProjects(filters: ProjectFilters) {
  const qs = filtersToQuery(filters);
  return useQuery({
    queryKey: ["projects", qs],
    queryFn: () => apiFetch<ProjectsResponse>(`/projects${qs ? `?${qs}` : ""}`),
    placeholderData: keepPreviousData,
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => apiFetch<Project>(`/projects/${id}`),
    enabled: !!id,
  });
}
