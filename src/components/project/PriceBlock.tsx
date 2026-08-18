import { cn } from "@/lib/cn";
import { discountPercent, formatINR } from "@/lib/format";

interface PriceBlockProps {
  recommended: number | null;
  discounted: number | null;
  original: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** 
 * Clean, baseline-aligned horizontal pricing:
 * [₹6,500] [7% OFF] [₹7,000] - strictly non-wrapping
 */
export function PriceBlock({
  recommended,
  discounted,
  original,
  size = "sm",
  className,
}: PriceBlockProps) {
  const sell = discounted ?? recommended;
  const strike = original && sell && original > sell ? original : null;
  const pct = discountPercent(strike, sell);

  if (size === "lg") {
    return (
      <div className={cn("space-y-1", className)}>
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="font-display font-extrabold text-fg text-2xl sm:text-3xl tracking-tight whitespace-nowrap">
            {formatINR(sell)}
          </span>
          {pct != null && (
            <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400 uppercase whitespace-nowrap">
              {pct}% OFF
            </span>
          )}
          {strike && (
            <span className="text-sm text-muted/60 line-through font-sans whitespace-nowrap">
              {formatINR(strike)}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Standard clean single-line horizontal alignment for cards - NEVER wraps
  return (
    <div className={cn("flex items-center gap-1.5 shrink-0 flex-nowrap whitespace-nowrap justify-end min-w-0", className)}>
      <span className="font-display font-extrabold text-fg text-sm sm:text-base md:text-lg tracking-tight leading-none whitespace-nowrap shrink-0">
        {formatINR(sell)}
      </span>
      {pct != null && (
        <span className="inline-flex items-center justify-center rounded bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-400 leading-none uppercase whitespace-nowrap shrink-0">
          {pct}% OFF
        </span>
      )}
      {strike && (
        <span className="text-[10px] sm:text-[11px] text-muted/60 line-through font-sans font-medium leading-none whitespace-nowrap shrink-0">
          {formatINR(strike)}
        </span>
      )}
    </div>
  );
}

export default PriceBlock;
