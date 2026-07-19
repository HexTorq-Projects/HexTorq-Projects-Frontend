import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet/10 border border-violet/20 mb-3 text-violet">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-fg">Admin Login</h2>
          <p className="text-sm text-muted mt-1">Sign in to manage HexTorq Projects</p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Admin Email" htmlFor="admin-email">
            <Input
              id="admin-email"
              type="email"
              required
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </Field>
          <Field label="Password" htmlFor="admin-password">
            <Input
              id="admin-password"
              type="password"
              required
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
          </Field>
          <Button type="submit" variant="auth" className="w-full mt-6" disabled={isPending}>
            {isPending && <Spinner className="text-white" />}
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
