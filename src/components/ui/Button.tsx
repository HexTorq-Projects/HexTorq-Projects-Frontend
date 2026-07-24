import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "solid" | "outline" | "ghost" | "auth" | "purple-accent";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet/60 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none";

const sizes: Record<ButtonSize, string> = {
  sm: "text-sm px-4 h-9",
  md: "text-sm px-5 h-11",
  lg: "text-base px-7 h-12",
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/25 border border-violet-400/30 hover:shadow-violet-500/40 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all",
  solid: "bg-surface-hi text-fg hover:bg-line",
  outline: "border border-line text-fg hover:border-violet/60 hover:bg-surface",
  ghost: "text-muted hover:text-fg hover:bg-surface",
  auth: "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white font-semibold shadow-md shadow-violet-500/20 border border-violet-400/30 hover:shadow-violet-500/35 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all",
  "purple-accent": "bg-violet/10 backdrop-blur-md border border-violet/30 hover:bg-violet/20 hover:border-violet/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] text-violet-txt shadow-sm",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
): string {
  return cn(base, sizes[size], variants[variant], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}
