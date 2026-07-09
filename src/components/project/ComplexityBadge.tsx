import { Badge } from "@/components/ui/Badge";

const COLORS: Record<string, string> = {
  "Low to Medium": "#4ade80",
  Medium: "#fbbf24",
  High: "#f87171",
};

export function ComplexityBadge({ complexity }: { complexity: string | null | undefined }) {
  if (!complexity) return null;
  return <Badge color={COLORS[complexity] ?? "#94a3b8"}>{complexity}</Badge>;
}
