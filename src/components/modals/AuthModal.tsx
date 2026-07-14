import React, { useState, useMemo } from "react";
import { X, Sparkles, Mail, Lock, User, Phone, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/store/useUiStore";
import { useLogin, useRegister } from "@/api/auth";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";
import { useLocation, useNavigate, Link } from "react-router-dom";

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

export function AuthModal() {
  const { authModal, closeAuth } = useUiStore();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<"login" | "register">(authModal.mode || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showReqs, setShowReqs] = useState(false);

  const level = useMemo(() => passwordStrength(password), [password]);
  const meta = strengthMeta[level];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const successCallback = () => {
      closeAuth();
      if (authModal.redirectTo) {
        navigate(authModal.redirectTo);
      } else if (location.pathname === "/login" || location.pathname === "/register") {
        navigate("/dashboard");
      }
    };

    if (mode === "login") {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: successCallback,
          onError: (err: any) => {
            setErrorMsg(err.message || "Invalid email or password");
          },
        }
      );
    } else {
      if (!name) {
        setErrorMsg("Full name is required");
        return;
      }
      registerMutation.mutate(
        { name, email, password, phone: phone || undefined },
        {
          onSuccess: successCallback,
          onError: (err: any) => {
            setErrorMsg(err.message || "Failed to create account");
          },
        }
      );
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <AnimatePresence>
      {authModal.open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-bg/85 backdrop-blur-md"
            onClick={() => !isPending && closeAuth()}
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-2xl glow-violet md:p-8 z-10"
          >
            {/* Twilight Haze soft accent glow */}
            <div className="twilight-orb w-64 h-64 -top-24 -right-20" aria-hidden="true" />

            <button
              onClick={closeAuth}
              disabled={isPending}
              className="absolute top-4 right-4 z-10 text-muted hover:text-fg disabled:opacity-50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet/10 border border-violet/20 mb-3 text-violet animate-pulse">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-fg">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-sm text-muted mt-1">
                {mode === "login"
                  ? "Sign in to save projects and enquire"
                  : "Register to save your wishlist and track project leads"}
              </p>
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative z-10 overflow-hidden rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-rose-400"
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              {mode === "register" && (
                <Field label="Full Name" htmlFor="name">
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    icon={<User className="h-4 w-4" />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                  />
                </Field>
              )}

              <Field label="Email Address" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  icon={<Mail className="h-4 w-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                />
              </Field>

              <Field label="Password" htmlFor="password">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  icon={<Lock className="h-4 w-4" />}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (mode === "register") setShowReqs(true); }}
                  disabled={isPending}
                  onFocus={() => { if (mode === "register") setShowReqs(true); }}
                />
                {mode === "login" && (
                  <div className="flex items-center justify-end mt-1">
                    <Link
                      to="/forgot-password"
                      onClick={() => { closeAuth(); }}
                      className="text-[11px] text-muted hover:text-violet-txt font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}
                {mode === "register" && showReqs && password && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-surface-hi overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-500", meta.bg)} style={{ width: level <= 1 ? "25%" : level === 2 ? "50%" : level === 3 ? "75%" : "100%" }} />
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

              {mode === "register" && (
                <Field label="Phone Number (WhatsApp preferred)" htmlFor="phone" hint="Optional, for direct project updates">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    icon={<Phone className="h-4 w-4" />}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isPending}
                  />
                </Field>
              )}

              <Button type="submit" variant="auth" className="w-full mt-6" disabled={isPending}>
                {isPending && <Spinner className="text-white" />}
                {isPending ? "Connecting..." : mode === "login" ? "Sign In" : "Sign Up"}
              </Button>
            </form>

            <div className="relative z-10 mt-5 text-center text-xs text-muted">
              {mode === "login" ? (
                <>
                  New to Hextorq?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-violet font-semibold hover:underline"
                    disabled={isPending}
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-violet font-semibold hover:underline"
                    disabled={isPending}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
