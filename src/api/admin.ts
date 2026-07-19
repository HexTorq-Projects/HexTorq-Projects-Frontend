import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApiFetch } from "./adminClient";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import type {
  AdminAuthResponse,
  AdminEnquiry,
  AdminOrder,
  AdminPaginated,
  AdminStats,
  AdminUser,
  AdminWishlistEntry,
  ApplicationAreaAdmin,
  Category,
  Offer,
  OfferInput,
  Project,
  ProjectInput,
  SubCategoryAdmin,
} from "./types";

// ---- auth ----
export function useAdminLogin() {
  const setAuth = useAdminAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      adminApiFetch<AdminAuthResponse>("/admin/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: (data) => setAuth(data.token, data.admin),
  });
}

// ---- users ----
export function useAdminUsers(page: number, search?: string) {
  const qs = new URLSearchParams({ page: String(page), ...(search ? { search } : {}) }).toString();
  return useQuery({
    queryKey: ["admin", "users", page, search],
    queryFn: () => adminApiFetch<AdminPaginated<AdminUser>>(`/admin/users?${qs}`, { auth: true }),
  });
}

export function useUpdateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<{ name: string; email: string; phone: string | null }> }) =>
      adminApiFetch<AdminUser>(`/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApiFetch<void>(`/admin/users/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

// ---- projects ----
export function useAdminProjects(page: number, search?: string) {
  const qs = new URLSearchParams({ page: String(page), ...(search ? { search } : {}) }).toString();
  return useQuery({
    queryKey: ["admin", "projects", page, search],
    queryFn: () => adminApiFetch<AdminPaginated<Project>>(`/admin/projects?${qs}`, { auth: true }),
  });
}

export function useCreateAdminProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProjectInput) =>
      adminApiFetch<Project>("/admin/projects", { method: "POST", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });
}

export function useUpdateAdminProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<ProjectInput> }) =>
      adminApiFetch<Project>(`/admin/projects/${id}`, { method: "PATCH", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });
}

export function useDeleteAdminProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApiFetch<void>(`/admin/projects/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });
}

// ---- collections: categories / sub-categories / application areas ----
export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => adminApiFetch<{ items: Category[] }>("/admin/categories", { auth: true }),
  });
}
export function useCreateAdminCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { categoryName: string }) =>
      adminApiFetch<Category>("/admin/categories", { method: "POST", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}
export function useUpdateAdminCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { categoryName: string } }) =>
      adminApiFetch<Category>(`/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}
export function useDeleteAdminCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApiFetch<void>(`/admin/categories/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

export function useAdminSubCategories() {
  return useQuery({
    queryKey: ["admin", "sub-categories"],
    queryFn: () => adminApiFetch<{ items: SubCategoryAdmin[] }>("/admin/sub-categories", { auth: true }),
  });
}
export function useCreateAdminSubCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { subCategoryName: string; categoryId: string }) =>
      adminApiFetch<SubCategoryAdmin>("/admin/sub-categories", { method: "POST", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "sub-categories"] }),
  });
}
export function useUpdateAdminSubCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<{ subCategoryName: string; categoryId: string }> }) =>
      adminApiFetch<SubCategoryAdmin>(`/admin/sub-categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "sub-categories"] }),
  });
}
export function useDeleteAdminSubCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApiFetch<void>(`/admin/sub-categories/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "sub-categories"] }),
  });
}

export function useAdminApplicationAreas() {
  return useQuery({
    queryKey: ["admin", "application-areas"],
    queryFn: () => adminApiFetch<{ items: ApplicationAreaAdmin[] }>("/admin/application-areas", { auth: true }),
  });
}
export function useCreateAdminApplicationArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { applicationAreaName: string }) =>
      adminApiFetch<ApplicationAreaAdmin>("/admin/application-areas", {
        method: "POST",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "application-areas"] }),
  });
}
export function useUpdateAdminApplicationArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { applicationAreaName: string } }) =>
      adminApiFetch<ApplicationAreaAdmin>(`/admin/application-areas/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "application-areas"] }),
  });
}
export function useDeleteAdminApplicationArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApiFetch<void>(`/admin/application-areas/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "application-areas"] }),
  });
}

// ---- orders ----
export function useAdminOrders(page: number, status?: string, search?: string) {
  const qs = new URLSearchParams({
    page: String(page),
    ...(status ? { status } : {}),
    ...(search ? { search } : {}),
  }).toString();
  return useQuery({
    queryKey: ["admin", "orders", page, status, search],
    queryFn: () => adminApiFetch<AdminPaginated<AdminOrder>>(`/admin/orders?${qs}`, { auth: true }),
  });
}
export function useUpdateAdminOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<{ status: string; paymentStatus: string }> }) =>
      adminApiFetch<AdminOrder>(`/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}
export function useVerifyAdminOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApiFetch<{ order: AdminOrder }>(`/admin/orders/${id}/verify`, { method: "POST", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}

// ---- enquiries ----
export function useAdminEnquiries(page: number, status?: string) {
  const qs = new URLSearchParams({ page: String(page), ...(status ? { status } : {}) }).toString();
  return useQuery({
    queryKey: ["admin", "enquiries", page, status],
    queryFn: () => adminApiFetch<AdminPaginated<AdminEnquiry>>(`/admin/enquiries?${qs}`, { auth: true }),
  });
}
export function useUpdateAdminEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApiFetch<AdminEnquiry>(`/admin/enquiries/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "enquiries"] }),
  });
}
export function useDeleteAdminEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApiFetch<void>(`/admin/enquiries/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "enquiries"] }),
  });
}

// ---- wishlist ----
export function useAdminWishlist(page: number) {
  return useQuery({
    queryKey: ["admin", "wishlist", page],
    queryFn: () => adminApiFetch<AdminPaginated<AdminWishlistEntry>>(`/admin/wishlist?page=${page}`, { auth: true }),
  });
}
export function useDeleteAdminWishlistEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApiFetch<void>(`/admin/wishlist/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "wishlist"] }),
  });
}

// ---- offers ----
export function useAdminOffers() {
  return useQuery({
    queryKey: ["admin", "offers"],
    queryFn: () => adminApiFetch<{ items: Offer[] }>("/admin/offers", { auth: true }),
  });
}
export function useCreateAdminOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: OfferInput) =>
      adminApiFetch<Offer>("/admin/offers", { method: "POST", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "offers"] }),
  });
}
export function useUpdateAdminOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<OfferInput> }) =>
      adminApiFetch<Offer>(`/admin/offers/${id}`, { method: "PATCH", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "offers"] }),
  });
}
export function useDeleteAdminOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApiFetch<void>(`/admin/offers/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "offers"] }),
  });
}

// ---- stats ----
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApiFetch<AdminStats>("/admin/stats", { auth: true }),
  });
}
