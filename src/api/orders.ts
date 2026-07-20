import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Order } from "./types";
import { useAuthStore } from "@/store/useAuthStore";

const KEY = ["orders"];

export function useOrders() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: KEY,
    queryFn: () => apiFetch<Order[]>("/orders", { auth: true }),
    enabled: !!token,
  });
}

export function useOrder(id: string | undefined) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => apiFetch<Order>(`/orders/${id}`, { auth: true }),
    enabled: !!token && !!id,
  });
}

export function useCreateCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      projectIds: string[];
      paymentType?: "FULL" | "ADVANCE";
      customerName?: string;
      customerEmail?: string;
      customerMobile?: string;
    }) =>
      apiFetch<{ order: Order; checkoutUrl: string }>("/orders/checkout", {
        method: "POST",
        auth: true,
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function usePayBalance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) =>
      apiFetch<{ order: Order; checkoutUrl: string }>(`/orders/${orderId}/pay-balance`, {
        method: "POST",
        auth: true,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useVerifyOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) =>
      apiFetch<{ order: Order; verification: unknown }>(`/orders/${orderId}/verify`, {
        method: "POST",
        auth: true,
      }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.setQueryData(["order", data.order.id], data.order);
    },
  });
}

export function useVerifyRedirect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: Record<string, string>) =>
      apiFetch<{ order: Order; verification: unknown }>("/orders/verify-redirect", {
        method: "POST",
        auth: true,
        body: JSON.stringify(params),
      }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.setQueryData(["order", data.order.id], data.order);
    },
  });
}
