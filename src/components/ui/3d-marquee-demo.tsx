import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import marqueeData from "@/components/ui/marquee-data.json";

export default function ThreeDMarqueeDemo() {
  const images = (marqueeData as { image?: string }[])
    .map((d) => d.image)
    .filter((s): s is string => Boolean(s));

  return (
    <div className="mx-auto my-10 max-w-7xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
      <ThreeDMarquee images={images} />
    </div>
  );
}
