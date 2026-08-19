import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "./client";
import { useAuthStore } from "@/store/useAuthStore";

// Retry transient failures (network hiccups, proxy timeouts) but never retry
// a real 401 — otherwise a dead session retries into an endless loop.
const transientRetry = (failureCount: number, error: unknown) => {
  if (error instanceof ApiError && error.status === 401) return false;
  return failureCount < 2;
};

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

export function useReferralCode() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["referral-code"],
    queryFn: () => apiFetch<ReferralCodeResponse>("/referrals/my-code", { auth: true }),
    enabled: !!token,
    retry: transientRetry,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export function useGenerateReferralCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch<ReferralCodeResponse>("/referrals/my-code", { auth: true }),
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
  return useQuery({
    queryKey: ["referral-earnings"],
    queryFn: () => apiFetch<ReferralEarningsResponse>("/referrals/earnings", { auth: true }),
    enabled: !!token,
    retry: transientRetry,
    refetchOnMount: "always",
    staleTime: 10_000,
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
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
  return useQuery({
    queryKey: ["referral-balance"],
    queryFn: () => apiFetch<BalanceResponse>("/referrals/balance", { auth: true }),
    enabled: !!token,
    retry: transientRetry,
    refetchOnMount: "always",
    staleTime: 10_000,
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
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
  return useQuery({
    queryKey: ["referral-referred-users"],
    queryFn: () => apiFetch<ReferredUsersResponse>("/referrals/referred-users", { auth: true }),
    enabled: !!token,
    retry: transientRetry,
    refetchOnMount: "always",
    staleTime: 5_000,
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
  });
}

export function useWithdrawalHistory() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["referral-withdrawals"],
    queryFn: () => apiFetch<WithdrawalHistoryItem[]>("/referrals/withdrawals", { auth: true }),
    enabled: !!token,
    retry: transientRetry,
    refetchOnMount: "always",
    staleTime: 10_000,
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
  });
}
