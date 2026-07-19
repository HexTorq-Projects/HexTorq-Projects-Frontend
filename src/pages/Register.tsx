import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Mail, Lock, User, Phone, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useRegister } from "@/api/auth";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { OrDivider } from "@/components/auth/OrDivider";
import { cn } from "@/lib/cn";

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

const strengthMeta: Record<StrengthLevel, { label: string; color: string; bg: string; width: string }> = {
  0: { label: "Very Weak", color: "text-rose-400", bg: "bg-rose-500/30", width: "w-0" },
  1: { label: "Weak", color: "text-rose-400", bg: "bg-rose-500", width: "w-1/4" },
  2: { label: "Fair", color: "text-amber-400", bg: "bg-amber-400", width: "w-2/4" },
  3: { label: "Strong", color: "text-emerald-400", bg: "bg-emerald-400", width: "w-3/4" },
  4: { label: "Very Strong", color: "text-emerald-400", bg: "bg-emerald-400", width: "w-full" },
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

export default function Register() {
  const { user } = useAuthStore();
  const registerMutation = useRegister();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const reduced = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showReqs, setShowReqs] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  const level = useMemo(() => passwordStrength(password), [password]);
  const meta = strengthMeta[level];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name) {
      setErrorMsg("Full name is required");
      return;
    }

    registerMutation.mutate(
      { name, email, password, phone: phone || undefined },
      {
        onSuccess: () => {
          navigate(redirectTo);
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to create account");
        },
      }
    );
  };

  const isPending = registerMutation.isPending;

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative overflow-hidden aurora grain">
      <div className="twilight-orb w-[26rem] h-[26rem] -top-24 -right-24" aria-hidden="true" />
      <div className="twilight-orb w-[22rem] h-[22rem] -bottom-28 -left-20" aria-hidden="true" />

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
            Get Started
          </h2>
          <p className="text-sm text-muted mt-1">
            Create a student account to manage wishlists and enquiries
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
          <Field label="Full Name" htmlFor="reg-name">
            <Input
              id="reg-name"
              type="text"
              placeholder="John Doe"
              required
              icon={<User className="h-4 w-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </Field>

          <Field label="Email Address" htmlFor="reg-email">
            <Input
              id="reg-email"
              type="email"
              placeholder="john@example.com"
              required
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </Field>

          <Field label="Password" htmlFor="reg-password">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint z-10">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="reg-password"
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
                    <div className={cn("h-full rounded-full transition-all duration-500", meta.bg)} style={{ width: meta.width === "w-0" ? "0%" : meta.width === "w-1/4" ? "25%" : meta.width === "w-2/4" ? "50%" : meta.width === "w-3/4" ? "75%" : "100%" }} />
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

          <Field label="Phone Number (WhatsApp preferred)" htmlFor="reg-phone" hint="Optional, for direct project updates">
            <Input
              id="reg-phone"
              type="tel"
              placeholder="9876543210"
              icon={<Phone className="h-4 w-4" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isPending}
            />
          </Field>

          <Button type="submit" variant="auth" className="w-full mt-6" disabled={isPending}>
            {isPending && <Spinner className="text-white" />}
            {isPending ? "Connecting..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-5 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
            className="text-violet font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
