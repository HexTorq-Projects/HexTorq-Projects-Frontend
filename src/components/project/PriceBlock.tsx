import { cn } from "@/lib/cn";
import { discountPercent, formatINR } from "@/lib/format";

interface PriceBlockProps {
  recommended: number | null;
  discounted: number | null;
  original: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Selling price = discounted ?? recommended; strike-through the higher original. */
export function PriceBlock({ recommended, discounted, original, size = "md", className }: PriceBlockProps) {
  const sell = discounted ?? recommended;
  const strike = original && sell && original > sell ? original : null;
  const pct = discountPercent(strike, sell);

  if (size === "sm") {
    return (
      <div className={cn("flex items-center gap-1.5 whitespace-nowrap shrink-0", className)}>
        <span className="font-display font-bold text-fg text-sm sm:text-base">
          {formatINR(sell)}
        </span>
        {strike && (
          <span className="text-[11px] text-faint line-through hidden sm:inline">
            {formatINR(strike)}
          </span>
        )}
        {pct != null && (
          <span className="rounded bg-emerald-500/15 px-1 py-0.5 text-[10px] font-bold text-emerald-400 leading-none">
            {pct}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span
        className={cn(
          "font-display font-semibold text-fg",
          size === "lg" ? "text-3xl" : "text-xl"
        )}
      >
        {formatINR(sell)}
      </span>
      {strike && <span className="text-sm text-faint line-through">{formatINR(strike)}</span>}
      {pct != null && (
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
          {pct}% off
        </span>
      )}
    </div>
  );
}
