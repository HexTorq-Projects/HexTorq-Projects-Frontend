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
  count: number;
  earnings: ReferralEarning[];
}

interface ClaimReferralInput {
  code: string;
  referredName?: string;
  referredEmail: string;
  projectTitle: string;
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
