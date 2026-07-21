import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { categoryMeta } from "@/lib/constants";
import { cn } from "@/lib/cn";

interface CategoryPillProps {
  name: string | null | undefined;
  short?: boolean;
  asLink?: boolean;
  className?: string;
}

export function CategoryPill({ name, short, asLink = false, className }: CategoryPillProps) {
  if (!name) return null;
  const m = categoryMeta(name);
  const label = short ? m.short : name;

  const content = (
    <span
      className={cn("accent-ink inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap shrink-0", className)}
      style={{ "--accent-ink-color": m.color } as CSSProperties}
    >
      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
      <span className="truncate max-w-[100px] sm:max-w-[140px]">{label}</span>
    </span>
  );

  if (asLink) {
    return (
      <Link to={`/category/${encodeURIComponent(name)}`} className="transition-opacity hover:opacity-80">
        {content}
      </Link>
    );
  }
  return content;
}
