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
 * [₹6,500] [7% OFF] [₹7,000]
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
          <span className="font-display font-extrabold text-fg text-2xl sm:text-3xl tracking-tight">
            {formatINR(sell)}
          </span>
          {pct != null && (
            <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-400 uppercase">
              {pct}% OFF
            </span>
          )}
          {strike && (
            <span className="text-sm text-muted/60 line-through font-sans">
              {formatINR(strike)}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Standard clean single-line horizontal alignment for cards
  return (
    <div className={cn("flex items-baseline gap-1.5 shrink-0 flex-wrap justify-end", className)}>
      <span className="font-display font-extrabold text-fg text-base sm:text-lg tracking-tight leading-none">
        {formatINR(sell)}
      </span>
      {pct != null && (
        <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 leading-none uppercase">
          {pct}% OFF
        </span>
      )}
      {strike && (
        <span className="text-[11px] text-muted/60 line-through font-sans font-medium leading-none">
          {formatINR(strike)}
        </span>
      )}
    </div>
  );
}

export default PriceBlock;
