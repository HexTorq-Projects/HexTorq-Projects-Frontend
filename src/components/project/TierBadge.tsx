import React from "react";

export function TierBadge({ tier }: { tier: string | null | undefined }) {
  if (!tier) return null;
  const isPremium = tier === "Premium" || tier.toLowerCase() === "premium";

  if (isPremium) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 text-[10px] font-semibold text-amber-300 tracking-wide shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
        Premium
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-surface-hi border border-line px-2 py-0.5 text-[10px] font-medium text-muted">
      {tier}
    </span>
  );
}
export default TierBadge;
