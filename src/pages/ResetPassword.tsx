import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Sparkles, Lock, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useResetPassword } from "@/api/auth";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

const strengthMeta: Record<StrengthLevel, { label: string; color: string; bg: string }> = {
  0: { label: "Very Weak", color: "text-rose-400", bg: "bg-rose-500/30" },
  1: { label: "Weak", color: "text-rose-400", bg: "bg-rose-500" },
  2: { label: "Fair", color: "text-amber-400", bg: "bg-amber-400" },
  3: { label: "Strong", color: "text-emerald-400", bg: "bg-emerald-400" },
  4: { label: "Very Strong", color: "text-emerald-400", bg: "bg-emerald-400" },
};

function passwordStrength(pw: string): StrengthLevel {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return 1;
  if (score === 2) return 2;
  if (score === 3) return 3;
  return 4;
}

const requirements = [
  { label: "At least 6 characters", test: (pw: string) => pw.length >= 6 },
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "Uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "Number", test: (pw: string) => /[0-9]/.test(pw) },
  { label: "Special character", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

export default function ResetPassword() {
  const resetMutation = useResetPassword();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const reduced = useReducedMotion();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [showReqs, setShowReqs] = useState(false);

  const level = useMemo(() => passwordStrength(password), [password]);
  const meta = strengthMeta[level];
  const passwordsMatch = password === confirmPassword;
  const canSubmit = password.length >= 6 && passwordsMatch && !!token;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!token) {
      setErrorMsg("Invalid or missing reset token");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    resetMutation.mutate(
      { token, password },
      {
        onSuccess: () => setSuccess(true),
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to reset password. The link may have expired.");
        },
      }
    );
  };

  const isPending = resetMutation.isPending;

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative overflow-hidden aurora grain">
        <div className="twilight-orb w-[26rem] h-[26rem] -top-24 -right-24" aria-hidden="true" />
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 18, scale: 0.98 }}
          animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-2xl glow-violet md:p-8 z-10 text-center"
        >
          <div className="flex flex-col items-center text-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-fg">
              Password Reset!
            </h2>
            <p className="text-sm text-muted mt-2">
              Your password has been updated successfully.
            </p>
          </div>
          <div className="mt-6">
            <Button
              variant="auth"
              size="md"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Sign In with New Password
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative overflow-hidden aurora grain">
        <div className="twilight-orb w-[26rem] h-[26rem] -top-24 -right-24" aria-hidden="true" />
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 18, scale: 0.98 }}
          animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-2xl glow-violet md:p-8 z-10 text-center"
        >
          <h2 className="font-display text-2xl font-bold tracking-tight text-fg">
            Invalid Link
          </h2>
          <p className="text-sm text-muted mt-2">
            This password reset link is invalid or missing a token.
          </p>
          <div className="mt-6">
            <Link to="/forgot-password">
              <Button variant="auth" size="md" className="w-full">
                Request New Reset Link
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
            Set New Password
          </h2>
          <p className="text-sm text-muted mt-1">
            Enter your new password below
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="New Password" htmlFor="reset-password">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint z-10">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="reset-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={6}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setShowReqs(true); }}
                disabled={isPending}
                onFocus={() => setShowReqs(true)}
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
            {showReqs && password && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-surface-hi overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-500", meta.bg)} style={{ width: level === 0 ? "0%" : level === 1 ? "25%" : level === 2 ? "50%" : level === 3 ? "75%" : "100%" }} />
                  </div>
                  <span className={cn("text-[11px] font-semibold whitespace-nowrap", meta.color)}>
                    {meta.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {requirements.map((req) => {
                    const passed = req.test(password);
                    return (
                      <div key={req.label} className="flex items-center gap-1.5 text-[11px]">
                        {passed ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="h-3 w-3 text-muted shrink-0" />
                        )}
                        <span className={passed ? "text-emerald-400" : "text-faint"}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </Field>

          <Field
            label="Confirm New Password"
            htmlFor="reset-confirm"
            error={confirmPassword && !passwordsMatch ? "Passwords do not match" : undefined}
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint z-10">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="reset-confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPending}
                className="w-full rounded-xl border border-line bg-bg-soft pl-10 pr-10 py-2.5 text-sm text-fg placeholder:text-faint transition-colors focus:outline-none focus:border-violet/70 focus:ring-2 focus:ring-violet/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-faint hover:text-fg transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <Button type="submit" variant="auth" className="w-full mt-6" disabled={isPending || !canSubmit}>
            {isPending && <Spinner className="text-white" />}
            {isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
