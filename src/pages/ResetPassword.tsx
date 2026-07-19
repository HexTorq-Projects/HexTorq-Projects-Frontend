import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Lock } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useResetPassword } from "@/api/auth";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

export default function ResetPassword() {
  const resetPasswordMutation = useResetPassword();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reduced = useReducedMotion();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const linkMissing = !email || !token;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    resetPasswordMutation.mutate(
      { email, token, newPassword },
      {
        onSuccess: () => navigate("/dashboard"),
        onError: (err: any) => setErrorMsg(err.message || "Failed to reset password"),
      }
    );
  };

  const isPending = resetPasswordMutation.isPending;

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
            Set New Password
          </h2>
          <p className="text-sm text-muted mt-1">Choose a new password for your account</p>
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

        {linkMissing ? (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400 text-center">
            This reset link is invalid. Please request a new one from the Forgot Password page.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="New Password" htmlFor="new-password">
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                icon={<Lock className="h-4 w-4" />}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isPending}
              />
            </Field>

            <Button type="submit" variant="auth" className="w-full mt-6" disabled={isPending}>
              {isPending && <Spinner className="text-white" />}
              {isPending ? "Saving..." : "Set Password"}
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
