/**
 * Visual single source of truth: tier / category / application-area colors.
 * Data-driven, so lookups fall back gracefully for names not listed here.
 */

export interface TierMeta {
  label: string;
  color: string;
  /** premium gets extra glow treatment */
  glow?: boolean;
}

export const TIER_META: Record<string, TierMeta> = {
  Basic: { label: "Basic", color: "#64748b" },
  Standard: { label: "Standard", color: "#38bdf8" },
  High: { label: "High", color: "#a855f7" },
  Premium: { label: "Premium", color: "#f5b944", glow: true },
};

export function tierMeta(tier: string | null | undefined): TierMeta {
  if (tier && TIER_META[tier]) return TIER_META[tier];
  return { label: tier || "Unrated", color: "#64748b" };
}

export const TIER_ORDER = ["Basic", "Standard", "High", "Premium"];
export const COMPLEXITY_ORDER = ["Low to Medium", "Medium", "High"];

export interface CategoryMeta {
  color: string;
  /** short label for compact chips */
  short: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  "AI/ML & Data Science": { color: "#a7b7e7", short: "AI / ML" },
  "Web Applications & Portals": { color: "#d8e2ff", short: "Web Apps" },
  "Web Development": { color: "#d8e2ff", short: "Web Dev" },
  "IoT, Embedded & Robotics": { color: "#a8d8c9", short: "IoT" },
  "Cybersecurity & Cloud Security": { color: "#e2a7b7", short: "Cyber" },
  "Mobile Applications": { color: "#e9c8a7", short: "Mobile" },
  "Biomedical & Healthcare": { color: "#a7e7df", short: "Biomed" },
  "Electronics & Power Systems": { color: "#e7baa7", short: "Electronics" },
  "Enterprise & Management Systems": { color: "#a7c7e7", short: "Enterprise" },
  "General Software Projects": { color: "#b7b7c7", short: "General" },
  "Networking & Wireless Communication": { color: "#a7d7e7", short: "Networking" },
  "Blockchain & Decentralized Systems": { color: "#c7a7e7", short: "Blockchain" },
  "Java Desktop / Enterprise": { color: "#e7a7a7", short: "Java" },
  ".NET / C# Applications": { color: "#b7a7e7", short: ".NET" },
};

/** Deterministic fallback color for any unlisted category name. */
function hashColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `hsl(${h}, 50%, 75%)`; // Softer pastel HSL fallback for Twilight theme
}

export function categoryMeta(name: string | null | undefined): CategoryMeta {
  if (!name) return { color: "#b7b7c7", short: "General" };
  return CATEGORY_META[name] ?? { color: hashColor(name), short: name };
}

export const APP_AREA_META: Record<string, string> = {
  "General Software": "#b7b7c7",
  Healthcare: "#a7e7df",
  Transportation: "#a7c7e7",
  Security: "#e2a7b7",
  Finance: "#a8d8c9",
  Education: "#e9c8a7",
  Environment: "#a8e7a7",
  Agriculture: "#c7e7a7",
  "E-Commerce": "#e7a7c7",
};

export function appAreaColor(name: string | null | undefined): string {
  if (!name) return "#b7b7c7";
  return APP_AREA_META[name] ?? hashColor(name);
}

/** WhatsApp number for the "enquire" manual-close flow (payments later). */
export const WHATSAPP_NUMBER = "918220348218";
export const CONTACT_EMAIL = "enquiry@hextorq.com";
