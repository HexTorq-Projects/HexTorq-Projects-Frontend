import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "./client";
import { queryClient } from "./queryClient";
import { useAuthStore } from "@/store/useAuthStore";

// Retry transient failures (network hiccups, proxy timeouts) but never retry
// a real 401 — otherwise a dead session retries into an endless loop.
const transientRetry = (failureCount: number, error: unknown) => {
  if (error instanceof ApiError && error.status === 401) return false;
  return failureCount < 2;
};

// The API host cold-starts after idle (first request can take ~10s). Cache the
// last successful referral payload in localStorage (per-user) so the page
// renders instantly from cache while the fresh fetch happens in the background.
const CACHE_PREFIX = "hextorq:referral:v1:";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// Keyed on the stable user id (JWT tokens change on every login, so they'd
// invalidate the cache each session). Falls back to a token fragment only
// before /auth/me has resolved.
function cacheNamespace(userId?: string | null, token?: string | null) {
  if (userId) return `u:${userId}`;
  return token ? `t:${token.slice(-12)}` : "anon";
}

function readCache<T>(namespace: string, query: string): T | undefined {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${namespace}:${query}`);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Date.now() - parsed.ts > CACHE_TTL_MS) return undefined;
    return parsed.data as T;
  } catch {
    return undefined;
  }
}

function writeCache(namespace: string, query: string, data: unknown) {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${namespace}:${query}`, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // storage unavailable/full — cache is best-effort only
  }
}

interface ReferralCodeResponse {
  code: string;
}

interface ReferralEarning {
  id: string;
  referredName: string;
  referredEmail: string;
  projectTitle: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface ReferralEarningsResponse {
  code?: string;
  totalEarned: number;
  pendingAmount: number;
  confirmedAmount: number;
  count: number;
  earnings: ReferralEarning[];
}

interface ClaimReferralInput {
  code: string;
  referredName?: string;
  referredEmail: string;
  projectTitle: string;
}

interface BalanceResponse {
  availableBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
}

interface WithdrawalResponse {
  id: string;
  amount: number;
  status: string;
}

export interface WithdrawalHistoryItem {
  id: string;
  amount: number;
  upiId: string;
  upiHolderName: string;
  status: string;
  adminNote: string | null;
  transactionId?: string | null;
  paidAt?: string | null;
  createdAt: string;
}

interface ReferredUser {
  id: string;
  name: string;
  email: string;
  signedUpAt: string;
  purchased: boolean;
}

interface ReferredUsersResponse {
  users: ReferredUser[];
}

function currentNamespace() {
  const { user, token } = useAuthStore.getState();
  return cacheNamespace(user?.id, token);
}

async function fetchReferralCodeData() {
  const data = await apiFetch<ReferralCodeResponse>("/referrals/my-code", { auth: true });
  writeCache(currentNamespace(), "code", data);
  return data;
}

async function fetchReferralEarningsData() {
  const data = await apiFetch<ReferralEarningsResponse>("/referrals/earnings", { auth: true });
  writeCache(currentNamespace(), "earnings", data);
  return data;
}

async function fetchReferralBalanceData() {
  const data = await apiFetch<BalanceResponse>("/referrals/balance", { auth: true });
  writeCache(currentNamespace(), "balance", data);
  return data;
}

async function fetchReferredUsersData() {
  const data = await apiFetch<ReferredUsersResponse>("/referrals/referred-users", { auth: true });
  writeCache(currentNamespace(), "referred-users", data);
  return data;
}

async function fetchWithdrawalHistoryData() {
  const data = await apiFetch<WithdrawalHistoryItem[]>("/referrals/withdrawals", { auth: true });
  writeCache(currentNamespace(), "withdrawals", data);
  return data;
}

const prefetchOpts = { retry: transientRetry, staleTime: 10_000 } as const;

/**
 * Warms all referral data as soon as a session exists (app boot / after login),
 * so the Refer & Earn tab renders from the in-memory cache the moment the user
 * opens it — even before the API host's cold start has fully caught up.
 */
export function prefetchReferralData() {
  const { token } = useAuthStore.getState();
  if (!token) return;
  void queryClient.prefetchQuery({ queryKey: ["referral-code"], queryFn: fetchReferralCodeData, ...prefetchOpts });
  void queryClient.prefetchQuery({ queryKey: ["referral-earnings"], queryFn: fetchReferralEarningsData, ...prefetchOpts });
  void queryClient.prefetchQuery({ queryKey: ["referral-balance"], queryFn: fetchReferralBalanceData, ...prefetchOpts });
  void queryClient.prefetchQuery({ queryKey: ["referral-referred-users"], queryFn: fetchReferredUsersData, ...prefetchOpts });
  void queryClient.prefetchQuery({ queryKey: ["referral-withdrawals"], queryFn: fetchWithdrawalHistoryData, ...prefetchOpts });
}

export function useReferralCode() {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);
  const ns = cacheNamespace(userId, token);
  return useQuery({
    queryKey: ["referral-code"],
    queryFn: fetchReferralCodeData,
    enabled: !!token,
    retry: transientRetry,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    initialData: token ? readCache<ReferralCodeResponse>(ns, "code") : undefined,
  });
}

export function useGenerateReferralCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => fetchReferralCodeData(),
    retry: transientRetry,
    onSuccess: (data) => {
      qc.setQueryData(["referral-code"], data);
      qc.invalidateQueries({ queryKey: ["referral-code"] });
      qc.invalidateQueries({ queryKey: ["referral-earnings"] });
    },
  });
}

export function useReferralEarnings() {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);
  const ns = cacheNamespace(userId, token);
  return useQuery({
    queryKey: ["referral-earnings"],
    queryFn: fetchReferralEarningsData,
    enabled: !!token,
    retry: transientRetry,
    refetchOnMount: "always",
    staleTime: 10_000,
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
    initialData: token ? readCache<ReferralEarningsResponse>(ns, "earnings") : undefined,
  });
}

export function useClaimReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ClaimReferralInput) =>
      apiFetch<{ id: string; amount: number; status: string }>("/referrals/claim", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referral-earnings"] });
    },
  });
}

export function useReferralBalance() {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);
  const ns = cacheNamespace(userId, token);
  return useQuery({
    queryKey: ["referral-balance"],
    queryFn: fetchReferralBalanceData,
    enabled: !!token,
    retry: transientRetry,
    refetchOnMount: "always",
    staleTime: 10_000,
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
    initialData: token ? readCache<BalanceResponse>(ns, "balance") : undefined,
  });
}

export function useWithdrawReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { amount: number; upiId: string; upiHolderName: string }) =>
      apiFetch<WithdrawalResponse>("/referrals/withdraw", {
        method: "POST",
        auth: true,
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referral-balance"] });
      qc.invalidateQueries({ queryKey: ["referral-withdrawals"] });
    },
  });
}

export function useReferredUsers() {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);
  const ns = cacheNamespace(userId, token);
  return useQuery({
    queryKey: ["referral-referred-users"],
    queryFn: fetchReferredUsersData,
    enabled: !!token,
    retry: transientRetry,
    refetchOnMount: "always",
    staleTime: 5_000,
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
    initialData: token ? readCache<ReferredUsersResponse>(ns, "referred-users") : undefined,
  });
}

export function useWithdrawalHistory() {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.user?.id);
  const ns = cacheNamespace(userId, token);
  return useQuery({
    queryKey: ["referral-withdrawals"],
    queryFn: fetchWithdrawalHistoryData,
    enabled: !!token,
    retry: transientRetry,
    refetchOnMount: "always",
    staleTime: 10_000,
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
    initialData: token ? readCache<WithdrawalHistoryItem[]>(ns, "withdrawals") : undefined,
  });
}
