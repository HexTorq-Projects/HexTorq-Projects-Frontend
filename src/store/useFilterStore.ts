import { create } from "zustand";
import type { ProjectFilters, SortOption } from "@/api/types";

interface FilterState extends ProjectFilters {
  setSearch: (v: string) => void;
  setCategory: (v?: string) => void;
  setApplicationArea: (v?: string) => void;
  setTier: (v?: string) => void;
  setComplexity: (v?: string) => void;
  setPrice: (min?: number, max?: number) => void;
  setSort: (v: SortOption) => void;
  setPage: (v: number) => void;
  patch: (p: Partial<ProjectFilters>) => void;
  reset: () => void;
}

const initial: ProjectFilters = { sort: "importance", page: 1 };

export const useFilterStore = create<FilterState>((set) => ({
  ...initial,
  setSearch: (search) => set({ search: search || undefined, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setApplicationArea: (applicationArea) => set({ applicationArea, page: 1 }),
  setTier: (tier) => set({ tier, page: 1 }),
  setComplexity: (complexity) => set({ complexity, page: 1 }),
  setPrice: (minPrice, maxPrice) => set({ minPrice, maxPrice, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  patch: (p) => set({ ...p }),
  reset: () => set({
    search: undefined,
    category: undefined,
    applicationArea: undefined,
    tier: undefined,
    complexity: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sort: "importance",
    page: 1,
  }),
}));

/** Extract just the API filter fields (drops the setter functions). */
export function selectFilters(s: FilterState): ProjectFilters {
  return {
    search: s.search,
    category: s.category,
    applicationArea: s.applicationArea,
    tier: s.tier,
    complexity: s.complexity,
    minPrice: s.minPrice,
    maxPrice: s.maxPrice,
    sort: s.sort,
    page: s.page,
  };
}

/** Count of active facet filters (for the mobile "Filters (n)" button). */
export function activeFilterCount(f: ProjectFilters): number {
  let n = 0;
  if (f.search) n++;
  if (f.category) n++;
  if (f.applicationArea) n++;
  if (f.tier) n++;
  if (f.complexity) n++;
  if (f.minPrice != null || f.maxPrice != null) n++;
  return n;
}
