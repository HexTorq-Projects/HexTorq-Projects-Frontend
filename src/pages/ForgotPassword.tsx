import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useForgotPassword } from "@/api/auth";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

export default function ForgotPassword() {
  const forgotMutation = useForgotPassword();
  const reduced = useReducedMotion();

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    forgotMutation.mutate(email, {
      onSuccess: () => setSent(true),
      onError: (err: any) => {
        setErrorMsg(err.message || "Something went wrong. Please try again.");
      },
    });
  };

  const isPending = forgotMutation.isPending;

  if (sent) {
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
              Check Your Email
            </h2>
            <p className="text-sm text-muted mt-2 max-w-xs mx-auto">
              If an account exists for <strong className="text-fg">{email}</strong>, we've sent a password reset link. It expires in 1 hour.
            </p>
          </div>
          <div className="mt-6 space-y-3">
            <p className="text-xs text-faint">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => setSent(false)}
            >
              Try a different email
            </Button>
            <Link
              to="/login"
              className="block text-center text-xs text-muted hover:text-violet-txt font-medium transition-colors"
            >
              <ArrowLeft className="h-3 w-3 inline mr-1" />
              Back to sign in
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
            Forgot Password?
          </h2>
          <p className="text-sm text-muted mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-rose-400">
            {errorMsg}
          </div>
        )}

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

        <div className="mt-5 text-center text-xs text-muted">
          <Link
            to="/login"
            className="text-violet font-semibold hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
