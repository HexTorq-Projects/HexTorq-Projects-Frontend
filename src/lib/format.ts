const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹4,937 style formatting. Returns "—" for null/undefined. */
export function formatINR(value: number | null | undefined): string {
  if (value == null) return "—";
  return inr.format(value);
}

/** Whole-number discount percent between original and discounted price. */
export function discountPercent(
  original: number | null | undefined,
  discounted: number | null | undefined
): number | null {
  if (!original || !discounted || discounted >= original) return null;
  return Math.round((1 - discounted / original) * 100);
}

/** Split a comma-separated string field (tech / modules) into clean tokens. */
export function splitList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Truncate to n chars on a word boundary with an ellipsis. */
export function truncate(text: string, n: number): string {
  if (text.length <= n) return text;
  return text.slice(0, text.lastIndexOf(" ", n)).trimEnd() + "…";
}

/** Friendly date like "2 Jul 2026". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
