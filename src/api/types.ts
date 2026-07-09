// ---- Relation summaries (from /categories, /application-areas) ----
export interface SubCategorySummary {
  id: string;
  name: string;
  count: number;
}
export interface CategorySummary {
  id: string;
  name: string;
  count: number;
  subCategories: SubCategorySummary[];
}
export interface AppAreaSummary {
  id: string;
  name: string;
  count: number;
}

// ---- Embedded relations on a Project ----
export interface ProjectCategory {
  id: string;
  categoryName: string;
}
export interface ProjectSubCategory {
  id: string;
  subCategoryName: string;
}
export interface ProjectAppArea {
  id: string;
  applicationAreaName: string;
}

export interface Project {
  id: string;
  projectTitle: string;
  brief: string;
  detailed: string;
  importanceScore: number;
  scoreBand: string;
  sellabilityTier: string | null;
  complexity: string | null;
  recommendedPrice: number | null;
  discountedPrice: number | null;
  originalPrice: number | null;
  suggestedTech: string | null;
  suggestedModules: string | null;
  category: ProjectCategory | null;
  subCategory: ProjectSubCategory | null;
  applicationArea: ProjectAppArea | null;
  rowCreatedTime: string;
}

export interface ProjectsResponse {
  items: Project[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
}

export type SortOption = "importance" | "price_asc" | "price_desc" | "newest";

export interface ProjectFilters {
  search?: string;
  category?: string;
  applicationArea?: string;
  tier?: string;
  complexity?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
  perPage?: number;
}

export interface Stats {
  totalProjects: number;
  categories: number;
  applicationAreas: number;
  premiumCount: number;
  tiers: Record<string, number>;
  priceRange: { min: number; max: number; avg: number };
}

// ---- Auth ----
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}
export interface AuthResponse {
  token: string;
  user: User;
}

// ---- Enquiries ----
export interface EnquiryInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  projectId?: string;
}
export interface MyEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  projectId: string | null;
  rowCreatedTime: string;
  project: {
    id: string;
    projectTitle: string;
    recommendedPrice: number | null;
    discountedPrice: number | null;
  } | null;
}
