import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Mail } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useForgotPassword } from "@/api/auth";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

export default function ForgotPassword() {
  const forgotPasswordMutation = useForgotPassword();
  const reduced = useReducedMotion();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    forgotPasswordMutation.mutate(email, {
      onSuccess: () => setSent(true),
      onError: (err: any) => setErrorMsg(err.message || "Something went wrong"),
    });
  };

  const isPending = forgotPasswordMutation.isPending;

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
            Forgot Password
          </h2>
          <p className="text-sm text-muted mt-1">
            Enter your email and we'll send you a link to set a new password
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

        {sent ? (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-400 text-center">
            If that email exists, a reset link has been sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email Address" htmlFor="forgot-email">
              <Input
                id="forgot-email"
                type="email"
                placeholder="john@example.com"
                required
                icon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
              />
            </Field>

            <Button type="submit" variant="auth" className="w-full mt-6" disabled={isPending}>
              {isPending && <Spinner className="text-white" />}
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        <div className="mt-5 text-center text-xs text-muted">
          <Link to="/login" className="text-violet font-semibold hover:underline">
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
