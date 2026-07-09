import type { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps {
  children: ReactNode;
  /** hex color used for text + tinted background/border */
  color?: string;
  className?: string;
  glow?: boolean;
}

export function Badge({ children, color = "#94a3b8", className, glow }: BadgeProps) {
  return (
    <span
      className={cn(
        "accent-ink inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-5",
        className
      )}
      style={{
        "--accent-ink-color": color,
        borderColor: `${color}55`,
        backgroundColor: `${color}1a`,
        boxShadow: glow ? `0 0 18px -4px ${color}aa` : undefined,
      } as CSSProperties}
    >
      {children}
    </span>
  );
}
