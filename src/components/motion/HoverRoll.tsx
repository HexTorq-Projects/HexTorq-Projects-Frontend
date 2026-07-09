import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface HoverRollProps {
  children: ReactNode;
  className?: string;
  /** Duration in ms for the roll transition. */
  duration?: number;
}

/**
 * Two stacked copies of the label that roll vertically on hover, revealing
 * the duplicate underneath — the "text roll back" hover effect.
 *
 * Must be used inside an ancestor carrying Tailwind's `group` class
 * (e.g. the Link/button wrapping this component).
 */
export function HoverRoll({ children, className, duration = 420 }: HoverRollProps) {
  return (
    <span className={cn("relative inline-block overflow-hidden align-top leading-tight", className)}>
      {/* Visible copy — rolls up and out on hover */}
      <span
        className="block transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full"
        style={{ transitionDuration: `${duration}ms` }}
      >
        {children}
      </span>
      {/* Duplicate copy — sits just below, rolls into view on hover */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 block translate-y-full transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
        style={{ transitionDuration: `${duration}ms` }}
      >
        {children}
      </span>
    </span>
  );
}
export default HoverRoll;
