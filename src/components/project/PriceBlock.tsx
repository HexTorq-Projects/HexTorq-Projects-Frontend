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
      <div className={cn("flex flex-col items-end text-right leading-none shrink-0 min-w-0", className)}>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span className="font-display font-bold text-fg text-xs sm:text-sm md:text-base">
            {formatINR(sell)}
          </span>
          {pct != null && (
            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-400">
              {pct}% off
            </span>
          )}
        </div>
        {strike && (
          <span className="text-[10px] sm:text-[11px] text-faint line-through mt-0.5 whitespace-nowrap">
            {formatINR(strike)}
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
