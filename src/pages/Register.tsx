import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Mail, Lock, User, Phone } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useRegister } from "@/api/auth";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

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
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

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
      {/* Twilight Haze soft accent glow */}
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
            <Input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
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
