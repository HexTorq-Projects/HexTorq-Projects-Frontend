import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client";
import { useAuthStore } from "@/store/useAuthStore";

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

interface WithdrawalHistoryItem {
  id: string;
  amount: number;
  upiId: string;
  upiHolderName: string;
  status: string;
  adminNote: string | null;
  createdAt: string;
}

export function useReferralCode() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["referral-code"],
    queryFn: () => apiFetch<ReferralCodeResponse>("/referrals/my-code", { auth: true }),
    enabled: !!token,
    staleTime: 10 * 60_000,
  });
}

export function useGenerateReferralCode() {
  return useMutation({
    mutationFn: () =>
      apiFetch<ReferralCodeResponse>("/referrals/my-code", { auth: true }),
  });
}

export function useReferralEarnings() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["referral-earnings"],
    queryFn: () => apiFetch<ReferralEarningsResponse>("/referrals/earnings", { auth: true }),
    enabled: !!token,
    staleTime: 30_000,
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
    staleTime: 30_000,
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

export function useWithdrawalHistory() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["referral-withdrawals"],
    queryFn: () => apiFetch<WithdrawalHistoryItem[]>("/referrals/withdrawals", { auth: true }),
    enabled: !!token,
  });
}
