import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { EnquiryInput, MyEnquiry } from "./types";
import { useAuthStore } from "@/store/useAuthStore";

export function useCreateEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: EnquiryInput) =>
      apiFetch<{ id: string; status: string }>("/enquiries", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enquiries", "me"] }),
  });
}

export function useMyEnquiries() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["enquiries", "me"],
    queryFn: () => apiFetch<MyEnquiry[]>("/enquiries/me", { auth: true }),
    enabled: !!token,
  });
}
