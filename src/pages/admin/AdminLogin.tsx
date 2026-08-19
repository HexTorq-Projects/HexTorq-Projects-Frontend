import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useAdminLogin } from "@/api/admin";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminLogin() {
  const token = useAdminAuthStore((s) => s.token);
  const loginMutation = useAdminLogin();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  React.useEffect(() => {
    if (token) navigate("/admin");
  }, [token, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => navigate("/admin"),
        onError: (err: any) => setErrorMsg(err.message || "Invalid admin credentials"),
      }
    );
  };

  const isPending = loginMutation.isPending;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-bg aurora grain overflow-hidden">
      {/* Background twilight orb glow */}
      <div className="twilight-orb w-[30rem] h-[30rem] -top-32 -left-32 z-0" aria-hidden="true" />
      <div className="twilight-orb w-[28rem] h-[28rem] -bottom-32 -right-32 z-0" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-line bg-surface/85 backdrop-blur-xl p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] space-y-6">
        {/* Top Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet to-cyan text-white shadow-xl shadow-violet-500/25">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-fg">
              Admin Portal
            </h2>
            <p className="text-xs text-muted">
              HexTorq Engineering Management & Telemetry System
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs font-semibold text-rose-400 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Admin Email Address" htmlFor="admin-email">
            <Input
              id="admin-email"
              type="email"
              required
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              placeholder="admin@hextorq.tech"
              className="bg-surface-hi/80 text-xs"
            />
          </Field>
          <Field label="Master Password" htmlFor="admin-password">
            <Input
              id="admin-password"
              type="password"
              required
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              placeholder="••••••••••••"
              className="bg-surface-hi/80 text-xs"
            />
          </Field>

          <Button
            type="submit"
            variant="primary"
            className="w-full h-12 text-sm shadow-xl shadow-violet-500/25 mt-4"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4 text-white" />
                Authenticating session...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In to Mission Control
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="pt-2 text-center border-t border-line/60">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-cyan transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to HexTorq Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
