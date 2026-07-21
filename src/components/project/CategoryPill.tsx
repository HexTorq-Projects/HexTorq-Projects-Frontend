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
      className={cn("accent-ink inline-flex items-center gap-1.5 text-xs font-semibold", className)}
      style={{ "--accent-ink-color": m.color } as CSSProperties}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
      {label}
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
