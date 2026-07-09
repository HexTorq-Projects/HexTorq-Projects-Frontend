import { Badge } from "@/components/ui/Badge";
import { tierMeta } from "@/lib/constants";

export function TierBadge({ tier }: { tier: string | null | undefined }) {
  const m = tierMeta(tier);
  return (
    <Badge color={m.color} glow={m.glow}>
      {m.label}
    </Badge>
  );
}
