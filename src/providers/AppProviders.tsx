import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { queryClient } from "@/api/queryClient";
import { AuthProvider } from "./AuthProvider";
import { LenisProvider } from "./LenisProvider";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export function AppProviders({ children }: { children: ReactNode }) {
  const content = (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LenisProvider>{children}</LenisProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );

  if (!GOOGLE_CLIENT_ID) return content;

  return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{content}</GoogleOAuthProvider>;
}
