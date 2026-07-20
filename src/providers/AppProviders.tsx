import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { queryClient } from "@/api/queryClient";
import { AuthProvider } from "./AuthProvider";
import { LenisProvider } from "./LenisProvider";

// Google OAuth Client IDs are public identifiers, not secrets (they're visible in
// browser JS regardless) — hardcoded as a fallback so sign-in works even if the
// hosting platform's env vars aren't configured. VITE_GOOGLE_CLIENT_ID still overrides.
const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ||
  "919142469320-am40k8k0vs7gm034ht808d6csu4l7sdp.apps.googleusercontent.com";

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
