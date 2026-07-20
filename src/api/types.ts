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

export interface ActiveOfferInfo {
  id: string;
  name: string;
  discountPercent: number;
  endsAt: string;
  advanceType: "FIXED" | "PERCENT" | null;
  advanceValue: number | null;
  advanceAmount: number | null;
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
  activeOffer: ActiveOfferInfo | null;
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

export interface OrderItem {
  id: string;
  projectId: string;
  projectTitleSnapshot: string;
  unitPrice: number;
  project: Project;
}

export interface OrderPayment {
  id: string;
  purpose: "FULL" | "ADVANCE" | "BALANCE";
  amount: number;
  status: string;
  payPandaPaymentId: string | null;
  checkoutUrl: string | null;
  bankRrn: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  rowCreatedTime: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  currency: string;
  paymentType: "FULL" | "ADVANCE";
  amountPaid: number;
  balanceDue: number;
  customerName: string;
  customerEmail: string;
  customerMobile: string | null;
  payPandaPaymentId: string | null;
  checkoutUrl: string | null;
  bankRrn: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  verificationCode: string | null;
  verificationMessage: string | null;
  rowCreatedTime: string;
  items: OrderItem[];
  payments: OrderPayment[];
}

// ---- Admin ----
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  googleId: string | null;
  rowCreatedTime: string;
  _count: { orders: number; wishlist: number; enquiries: number };
}

export interface AdminOrder extends Order {
  user: { id: string; name: string; email: string };
}

export interface AdminEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  projectId: string | null;
  rowCreatedTime: string;
  project: { id: string; projectTitle: string } | null;
}

export interface AdminWishlistEntry {
  id: string;
  rowCreatedTime: string;
  user: { id: string; name: string; email: string };
  project: { id: string; projectTitle: string };
}

export interface Category {
  id: string;
  categoryName: string;
}
export interface SubCategoryAdmin {
  id: string;
  subCategoryName: string;
  categoryId: string;
  category: Category;
}
export interface ApplicationAreaAdmin {
  id: string;
  applicationAreaName: string;
}

export interface ProjectInput {
  projectTitle: string;
  brief: string;
  detailed: string;
  importanceScore: number;
  scoreBand: string;
  sellabilityTier?: string | null;
  complexity?: string | null;
  recommendedPrice?: number | null;
  discountedPrice?: number | null;
  originalPrice?: number | null;
  suggestedTech?: string | null;
  suggestedModules?: string | null;
  categoryId: string;
  subCategoryId?: string | null;
  applicationAreaId?: string | null;
}

export type OfferScopeType = "ALL" | "CATEGORY" | "SUBCATEGORY" | "PROJECT";

export type AdvanceType = "FIXED" | "PERCENT";

export interface Offer {
  id: string;
  name: string;
  scopeType: OfferScopeType;
  categoryId: string | null;
  category: Category | null;
  subCategoryId: string | null;
  subCategory: SubCategoryAdmin | null;
  discountPercent: number;
  advanceType: AdvanceType | null;
  advanceValue: number | null;
  startsAt: string;
  endsAt: string;
  active: boolean;
  projects: { project: { id: string; projectTitle: string } }[];
  rowCreatedTime: string;
}

export interface OfferInput {
  name: string;
  scopeType: OfferScopeType;
  categoryId?: string | null;
  subCategoryId?: string | null;
  projectIds?: string[];
  discountPercent: number;
  advanceType?: AdvanceType | null;
  advanceValue?: number | null;
  startsAt: string;
  endsAt: string;
  active?: boolean;
}

export interface AdminPaginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
}

export interface AdminStats {
  userCount: number;
  projectCount: number;
  orderStatusCounts: Record<string, number>;
  totalRevenue: number;
  activeOfferCount: number;
  newEnquiryCount: number;
}

export interface AdminIdentity {
  email: string;
}
export interface AdminAuthResponse {
  token: string;
  admin: AdminIdentity;
}
