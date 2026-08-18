import { cn } from "@/lib/cn";
import { discountPercent, formatINR } from "@/lib/format";

interface PriceBlockProps {
  recommended: number | null;
  discounted: number | null;
  original: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  align?: "left" | "right";
}

/** Selling price = discounted ?? recommended; strike-through the higher original below. */
export function PriceBlock({
  recommended,
  discounted,
  original,
  size = "md",
  className,
  align = "left",
}: PriceBlockProps) {
  const sell = discounted ?? recommended;
  const strike = original && sell && original > sell ? original : null;
  const pct = discountPercent(strike, sell);

  if (size === "sm") {
    return (
      <div
        className={cn(
          "flex flex-col shrink-0 min-w-0",
          align === "right" ? "items-end text-right" : "items-start text-left",
          className
        )}
      >
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-display font-bold text-fg text-base sm:text-lg tracking-tight">
            {formatINR(sell)}
          </span>
          {pct != null && (
            <span className="inline-flex items-center rounded-md bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 leading-none">
              {pct}% off
            </span>
          )}
        </div>
        {strike && (
          <span className="text-[11px] text-faint line-through mt-0.5 font-sans font-medium">
            {formatINR(strike)}
          </span>
        )}
      </div>
    );
  }

  if (size === "lg") {
    return (
      <div className={cn("space-y-1", className)}>
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="font-display font-extrabold text-fg text-2xl sm:text-3xl tracking-tight">
            {formatINR(sell)}
          </span>
          {pct != null && (
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
              {pct}% off
            </span>
          )}
        </div>
        {strike && (
          <div className="text-sm text-faint line-through">
            Original Price: {formatINR(strike)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="font-display font-bold text-fg text-xl tracking-tight">
          {formatINR(sell)}
        </span>
        {pct != null && (
          <span className="rounded-md bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 text-xs font-semibold text-emerald-400">
            {pct}% off
          </span>
        )}
      </div>
      {strike && <span className="text-xs text-faint line-through mt-0.5">{formatINR(strike)}</span>}
    </div>
  );
}
export default PriceBlock;
