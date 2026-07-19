import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogin } from "@/api/auth";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { OrDivider } from "@/components/auth/OrDivider";

export default function Login() {
  const { user } = useAuthStore();
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const reduced = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate(redirectTo);
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Invalid email or password");
        },
      }
    );
  };

  const isPending = loginMutation.isPending;

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative overflow-hidden aurora grain">
      <div className="twilight-orb w-[26rem] h-[26rem] -top-24 -left-24" aria-hidden="true" />
      <div className="twilight-orb w-[22rem] h-[22rem] -bottom-28 -right-20" aria-hidden="true" />

      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 18, scale: 0.98 }}
        animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-2xl glow-violet md:p-8 z-10"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet/10 border border-violet/20 mb-3 text-violet animate-pulse">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-fg">
            Welcome Back
          </h2>
          <p className="text-sm text-muted mt-1">
            Sign in to access your Hextorq dashboard
          </p>
        </div>

        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-rose-400"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <GoogleAuthButton
          onSuccess={() => navigate(redirectTo)}
          onError={(msg) => setErrorMsg(msg)}
        />
        <OrDivider />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email Address" htmlFor="login-email">
            <Input
              id="login-email"
              type="email"
              placeholder="john@example.com"
              required
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </Field>

          <Field label="Password" htmlFor="login-password">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint z-10">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                className="w-full rounded-xl border border-line bg-bg-soft pl-10 pr-10 py-2.5 text-sm text-fg placeholder:text-faint transition-colors focus:outline-none focus:border-violet/70 focus:ring-2 focus:ring-violet/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-faint hover:text-fg transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <div className="flex items-center justify-end -mt-1">
            <Link
              to="/forgot-password"
              className="text-xs text-muted hover:text-violet-txt font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="auth" className="w-full mt-6" disabled={isPending}>
            {isPending && <Spinner className="text-white" />}
            {isPending ? "Connecting..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-5 text-center text-xs text-muted">
          Don't have an account?{" "}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirectTo)}`}
            className="text-violet font-semibold hover:underline"
          >
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
