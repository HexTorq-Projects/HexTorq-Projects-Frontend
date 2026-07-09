import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Project } from "./types";
import { useAuthStore } from "@/store/useAuthStore";

const KEY = ["wishlist"];

export function useWishlist() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: KEY,
    queryFn: () => apiFetch<Project[]>("/wishlist", { auth: true }),
    enabled: !!token,
  });
}

export function useAddWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (project: Project) =>
      apiFetch("/wishlist", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ projectId: project.id }),
      }),
    // optimistic: show the heart filled immediately
    onMutate: async (project) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Project[]>(KEY) ?? [];
      if (!prev.some((p) => p.id === project.id)) {
        qc.setQueryData<Project[]>(KEY, [project, ...prev]);
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useRemoveWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) =>
      apiFetch(`/wishlist/${projectId}`, { method: "DELETE", auth: true }),
    onMutate: async (projectId) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Project[]>(KEY) ?? [];
      qc.setQueryData<Project[]>(
        KEY,
        prev.filter((p) => p.id !== projectId)
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
