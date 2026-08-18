import React from "react";

const STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Low to Medium": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25" },
  Medium: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/25" },
  High: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/25" },
};

export function ComplexityBadge({ complexity }: { complexity: string | null | undefined }) {
  if (!complexity) return null;
  const s = STYLES[complexity] || { bg: "bg-surface-hi", text: "text-muted", border: "border-line" };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${s.bg} ${s.text} ${s.border}`}
    >
      {complexity}
    </span>
  );
}
export default ComplexityBadge;
