import { useEffect, useRef, useState } from "react";
import { GoogleLogin, useGoogleOAuth, type CredentialResponse } from "@react-oauth/google";
import { useGoogleLogin as useGoogleLoginMutation } from "@/api/auth";

// Same hardcoded fallback as AppProviders.tsx — Client IDs aren't secret.
const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ||
  "919142469320-am40k8k0vs7gm034ht808d6csu4l7sdp.apps.googleusercontent.com";

interface GoogleAuthButtonProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

function GoogleButtonInner({ onSuccess, onError }: GoogleAuthButtonProps) {
  const googleLoginMutation = useGoogleLoginMutation();
  const { scriptLoadedSuccessfully } = useGoogleOAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(Math.round(w));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      onError("Google sign-in failed. Please try again.");
      return;
    }
    googleLoginMutation.mutate(credentialResponse.credential, {
      onSuccess,
      onError: (err: any) => {
        onError(err.message || "Google sign-in failed. Please try again.");
      },
    });
  };

  const ready = scriptLoadedSuccessfully && width > 0;

  return (
    <div ref={containerRef} className="w-full">
      {!ready && (
        <div className="h-11 w-full animate-pulse rounded-xl border border-line bg-bg-soft" />
      )}
      {ready && (
        <GoogleLogin
          width={width}
          ux_mode="redirect"
          onSuccess={handleSuccess}
          onError={() => onError("Google sign-in failed. Please try again.")}
          useOneTap={false}
        />
      )}
    </div>
  );
}

export function GoogleAuthButton(props: GoogleAuthButtonProps) {
  if (!GOOGLE_CLIENT_ID) return null;
  return <GoogleButtonInner {...props} />;
}
