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
  DeliveryBoardResponse,
  MeetSchedule,
  Offer,
  OfferInput,
  Project,
  ProjectInput,
  ServiceMatrix,
  StaffMember,
  SubCategoryAdmin,
  SupportTicket,
  SystemSettings,
  User,
  VisitSchedule,
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
export function useAdminUsers(page: number, search?: string, authProvider?: string) {
  const qs = new URLSearchParams({
    page: String(page),
    ...(search ? { search } : {}),
    ...(authProvider ? { authProvider } : {}),
  }).toString();
  return useQuery({
    queryKey: ["admin", "users", page, search, authProvider],
    queryFn: () => adminApiFetch<AdminPaginated<AdminUser>>(`/admin/users?${qs}`, { auth: true }),
  });
}

export function useUserDetail(id: string | null) {
  return useQuery({
    queryKey: ["admin", "user-detail", id],
    queryFn: () => adminApiFetch<{ user: any; totalSpent: number }>(`/admin/users/${id}/detail`, { auth: true }),
    enabled: !!id,
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
export function useAdminProjects(page: number, search?: string, tier?: string, category?: string) {
  const qs = new URLSearchParams({
    page: String(page),
    ...(search ? { search } : {}),
    ...(tier ? { tier } : {}),
    ...(category ? { category } : {}),
  }).toString();
  return useQuery({
    queryKey: ["admin", "projects", page, search, tier, category],
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

export function useDuplicateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApiFetch<Project>(`/admin/projects/${id}/duplicate`, { method: "POST", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "projects"] }),
  });
}

export function useBulkImportProjects() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: any[]) =>
      adminApiFetch<{ success: boolean; importedCount: number; failedCount: number; errors: string[] }>(
        "/admin/projects/bulk-import",
        { method: "POST", body: JSON.stringify({ items }), auth: true }
      ),
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

// ---- collections ----
export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => adminApiFetch<AdminPaginated<Category>>("/admin/categories", { auth: true }),
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
    queryFn: () => adminApiFetch<AdminPaginated<SubCategoryAdmin>>("/admin/sub-categories", { auth: true }),
  });
}

export function useCreateAdminSubCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { subCategoryName: string; categoryId: string }) =>
      adminApiFetch<SubCategoryAdmin>("/admin/sub-categories", {
        method: "POST",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "sub-categories"] }),
  });
}

export function useUpdateAdminSubCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { subCategoryName: string; categoryId: string } }) =>
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
    queryFn: () => adminApiFetch<AdminPaginated<ApplicationAreaAdmin>>("/admin/application-areas", { auth: true }),
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
    mutationFn: (id: string) => adminApiFetch<void>(`/admin/application-areas/${id}`, { method: "DELETE", auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "application-areas"] }),
  });
}

// ---- orders ----
export function useAdminOrders(
  page: number,
  status?: string,
  search?: string,
  deliveryStatus?: string,
  serviceTier?: string,
  slaBreached?: boolean
) {
  const qs = new URLSearchParams({
    page: String(page),
    ...(status ? { status } : {}),
    ...(search ? { search } : {}),
    ...(deliveryStatus ? { deliveryStatus } : {}),
    ...(serviceTier ? { serviceTier } : {}),
    ...(slaBreached ? { slaBreached: "true" } : {}),
  }).toString();
  return useQuery({
    queryKey: ["admin", "orders", page, status, search, deliveryStatus, serviceTier, slaBreached],
    queryFn: () => adminApiFetch<AdminPaginated<AdminOrder>>(`/admin/orders?${qs}`, { auth: true }),
  });
}

export function useAdminOrder(id: string | null) {
  return useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => adminApiFetch<AdminOrder>(`/admin/orders/${id}`, { auth: true }),
    enabled: !!id,
  });
}

export function useUpdateAdminOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<{ status: string; paymentStatus: string; deliveryStatus: string; serviceTier: string; assignedToId: string | null; internalNotes: string | null }> }) =>
      adminApiFetch<AdminOrder>(`/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "delivery"] });
    },
  });
}

export function useVerifyAdminOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApiFetch<{ order: AdminOrder; verification: any }>(`/admin/orders/${id}/verify`, {
        method: "POST",
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}

// ---- enterprise delivery board ----
export function useAdminDeliveryBoard() {
  return useQuery({
    queryKey: ["admin", "delivery", "board"],
    queryFn: () => adminApiFetch<DeliveryBoardResponse>("/admin/delivery/board", { auth: true }),
    refetchInterval: 30000,
  });
}

export function useUpdateDeliveryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, deliveryStatus, action, note, assignedToId }: { id: string; deliveryStatus: string; action?: string; note?: string; assignedToId?: string | null }) =>
      adminApiFetch<AdminOrder>(`/admin/delivery/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ deliveryStatus, action, note, assignedToId }),
        auth: true,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "delivery"] });
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

export function useSendProjectPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, downloadUrl, packageVersion, customNote }: { id: string; downloadUrl?: string; packageVersion?: string; customNote?: string }) =>
      adminApiFetch<{ success: boolean; order: AdminOrder }>(`/admin/delivery/orders/${id}/send-package`, {
        method: "POST",
        body: JSON.stringify({ downloadUrl, packageVersion, customNote }),
        auth: true,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "delivery"] });
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

// ---- staff team ----
export function useAdminStaff() {
  return useQuery({
    queryKey: ["admin", "staff"],
    queryFn: () => adminApiFetch<{ items: StaffMember[] }>("/admin/staff", { auth: true }),
  });
}

export function useCreateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; email: string; password: string; role: string }) =>
      adminApiFetch<StaffMember>("/admin/staff", { method: "POST", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "staff"] }),
  });
}

export function useUpdateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<{ name: string; email: string; role: string; isActive: boolean; password?: string }> }) =>
      adminApiFetch<StaffMember>(`/admin/staff/${id}`, { method: "PATCH", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "staff"] }),
  });
}

// ---- calendar (meets & visits) ----
export function useAdminCalendar() {
  return useQuery({
    queryKey: ["admin", "calendar"],
    queryFn: () => adminApiFetch<{ meets: MeetSchedule[]; visits: VisitSchedule[] }>("/admin/calendar", { auth: true }),
  });
}

export function useScheduleMeet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { orderId: string; scheduledAt: string; meetLink?: string; note?: string }) =>
      adminApiFetch<MeetSchedule>("/admin/calendar/meets", { method: "POST", body: JSON.stringify(body), auth: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "calendar"] });
      qc.invalidateQueries({ queryKey: ["admin", "delivery"] });
    },
  });
}

export function useScheduleVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { orderId: string; scheduledAt: string; location: string; note?: string }) =>
      adminApiFetch<VisitSchedule>("/admin/calendar/visits", { method: "POST", body: JSON.stringify(body), auth: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "calendar"] });
      qc.invalidateQueries({ queryKey: ["admin", "delivery"] });
    },
  });
}

// ---- support tickets ----
export function useAdminTickets(status?: string) {
  const qs = status ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["admin", "tickets", status],
    queryFn: () => adminApiFetch<{ items: SupportTicket[] }>(`/admin/tickets${qs}`, { auth: true }),
  });
}

export function useReplyTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body, status }: { id: string; body: string; status?: string }) =>
      adminApiFetch<{ message: any; ticket: SupportTicket }>(`/admin/tickets/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ body, status }),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tickets"] }),
  });
}

export function useUpdateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<{ status: string; priority: string; assignedToId: string | null }> }) =>
      adminApiFetch<SupportTicket>(`/admin/tickets/${id}`, { method: "PATCH", body: JSON.stringify(body), auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tickets"] }),
  });
}

// ---- services & tier matrix ----
export function useAdminServiceMatrix() {
  return useQuery({
    queryKey: ["admin", "services", "matrix"],
    queryFn: () => adminApiFetch<ServiceMatrix>("/admin/services/matrix", { auth: true }),
  });
}

export function useUpdateServiceMatrix() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ServiceMatrix) =>
      adminApiFetch<{ message: string; matrix: ServiceMatrix }>("/admin/services/matrix", {
        method: "PUT",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "services", "matrix"] }),
  });
}

// ---- system settings ----
export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => adminApiFetch<SystemSettings>("/admin/settings", { auth: true }),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<SystemSettings>) =>
      adminApiFetch<{ message: string; settings: SystemSettings }>("/admin/settings", {
        method: "PUT",
        body: JSON.stringify(body),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });
}

export function useAdminEmailTemplates() {
  return useQuery({
    queryKey: ["admin", "settings", "email-templates"],
    queryFn: () => adminApiFetch<{ templates: any[] }>("/admin/settings/email-templates", { auth: true }),
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
    queryFn: () => adminApiFetch<AdminPaginated<Offer>>("/admin/offers", { auth: true }),
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
    refetchInterval: 15000,
  });
}

// ---- referral types ----
interface AdminReferralEarning {
  id: string;
  referrerName: string;
  referrerEmail: string;
  referredName: string;
  referredEmail: string;
  projectTitle: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface AdminReferralWithdrawal {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  upiId: string;
  upiHolderName: string;
  status: string;
  adminNote: string | null;
  transactionId?: string | null;
  paidAt?: string | null;
  createdAt: string;
}

interface AdminReferralStats {
  totalCodes: number;
  totalEarnings: number;
  referredUsers: number;
  pendingAmount: number;
  confirmedAmount: number;
  pendingRewards: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  pendingWithdrawalAmount: number;
}

interface AdminReferrer {
  id: string;
  code: string;
  referrerName: string;
  referrerEmail: string;
  joinedAt: string;
  referrals: number;
  purchases: number;
  earned: number;
  pending: number;
  confirmed: number;
  withdrawn: number;
  available: number;
}

interface ReferralPaginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ---- admin referrals ----
export function useAdminReferralStats() {
  return useQuery({
    queryKey: ["admin", "referrals", "stats"],
    queryFn: () => adminApiFetch<AdminReferralStats>("/admin/referrals/stats", { auth: true }),
  });
}

export function useAdminReferralEarnings(page: number, status?: string) {
  const qs = new URLSearchParams({
    page: String(page),
    ...(status ? { status } : {}),
  }).toString();
  return useQuery({
    queryKey: ["admin", "referrals", "earnings", page, status],
    queryFn: () => adminApiFetch<ReferralPaginated<AdminReferralEarning>>(`/admin/referrals/earnings?${qs}`, { auth: true }),
  });
}

export function useAdminReferrers(page: number) {
  return useQuery({
    queryKey: ["admin", "referrals", "referrers", page],
    queryFn: () => adminApiFetch<ReferralPaginated<AdminReferrer>>(`/admin/referrals/referrers?page=${page}`, { auth: true }),
  });
}

export function useUpdateAdminReferralEarning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApiFetch<AdminReferralEarning>(`/admin/referrals/earnings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "referrals"] }),
  });
}

export function useAdminReferralWithdrawals(page: number, status?: string) {
  const qs = new URLSearchParams({
    page: String(page),
    ...(status ? { status } : {}),
  }).toString();
  return useQuery({
    queryKey: ["admin", "referrals", "withdrawals", page, status],
    queryFn: () => adminApiFetch<ReferralPaginated<AdminReferralWithdrawal>>(`/admin/referrals/withdrawals?${qs}`, { auth: true }),
  });
}

export function useUpdateAdminReferralWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, transactionId, adminNote }: { id: string; status: string; transactionId?: string; adminNote?: string }) =>
      adminApiFetch<AdminReferralWithdrawal>(`/admin/referrals/withdrawals/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, ...(transactionId ? { transactionId } : {}), ...(adminNote ? { adminNote } : {}) }),
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "referrals"] }),
  });
}
