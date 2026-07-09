import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "@/api/queryClient";
import { AuthProvider } from "./AuthProvider";
import { LenisProvider } from "./LenisProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LenisProvider>{children}</LenisProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
