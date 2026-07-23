import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import marqueeData from "./marquee-data.json";

/** Data manifest produced by scripts/take_marquee_shots.py — real project-page
 *  screenshots from projects.hextorq.tech. We only need the image URLs here. */
type MarqueeDatum = { image?: string };
const DATA_IMAGES = (marqueeData as MarqueeDatum[])
  .map((d) => d.image)
  .filter((s): s is string => Boolean(s));

/** Fallback if the screenshot pipeline hasn't run (keeps the build functional). */
const FALLBACK_IMAGES = DATA_IMAGES.length ? DATA_IMAGES : [];

/** Per-column loop time (seconds). Even columns drift up, odd columns down. */
const COLUMN_DURATION = [42, 54, 47, 60];

// One continuously-scrolling column of image tiles.
function MarqueeColumn({
  images,
  duration,
  direction,
}: {
  images: string[];
  duration: number;
  direction: "up" | "down";
}) {
  // Duplicate the deck so the 50% translate loops with no visible seam.
  const loop = [...images, ...images];
  const distance = direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"];
  return (
    <motion.div
      className="flex flex-col items-start gap-8"
      animate={{ y: distance }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <GridLineVertical className="-left-4" offset="80px" />
      {loop.map((image, i) => (
        <div className="relative" key={i + image}>
          <GridLineHorizontal className="-top-4" offset="20px" />
          <motion.img
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            src={image}
            alt={`Project ${i + 1}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            width={970}
            height={700}
            className="aspect-[970/700] w-full select-none rounded-lg object-cover object-top ring-1 ring-white/10 transition-shadow hover:shadow-2xl"
          />
        </div>
      ))}
    </motion.div>
  );
}

export const ThreeDMarquee = ({
  images,
  className,
}: {
  /** Optional override; defaults to the real project screenshots. */
  images?: string[];
  className?: string;
}) => {
  const source = images && images.length > 0 ? images : FALLBACK_IMAGES;

  // Split into 4 balanced columns (round-robin keeps every column full).
  const columns: string[][] = [[], [], [], []];
  source.forEach((img, i) => columns[i % 4].push(img));

  return (
    <div
      className={cn(
        "mx-auto block h-[600px] w-full overflow-hidden rounded-3xl max-sm:h-[420px]",
        className,
      )}
    >
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-[0.55] sm:scale-75 lg:scale-100">
          <div
            style={{
              // Orthographic tilt (NO perspective) → the clean "receding floor".
              transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
              transformStyle: "preserve-3d",
            }}
            className="relative right-[50%] top-96 grid size-full origin-top-left grid-cols-4 gap-8"
          >
            {columns.map((col, i) => (
              <MarqueeColumn
                key={i}
                images={col}
                duration={COLUMN_DURATION[i]}
                direction={i % 2 === 0 ? "up" : "down"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Decorative grid lines (light-on-dark; the site has no Tailwind `dark`
// class, so colors are hardcoded for the dark surface). ────────────────────
const GridLineHorizontal = ({ className, offset }: { className?: string; offset?: string }) => (
  <div
    style={
      {
        "--color": "rgba(255,255,255,0.15)",
        "--height": "1px",
        "--width": "5px",
        "--fade-stop": "90%",
        "--offset": offset || "200px",
        maskComposite: "exclude",
      } as React.CSSProperties
    }
    className={cn(
      "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
      "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
      "[background-size:var(--width)_var(--height)]",
      "[mask:linear-gradient(to_left,white_var(--fade-stop),transparent),_linear-gradient(to_right,white_var(--fade-stop),transparent),_linear-gradient(black,black)]",
      "[mask-composite:exclude]",
      "z-30",
      className,
    )}
  />
);

const GridLineVertical = ({ className, offset }: { className?: string; offset?: string }) => (
  <div
    style={
      {
        "--color": "rgba(255,255,255,0.15)",
        "--height": "5px",
        "--width": "1px",
        "--fade-stop": "90%",
        "--offset": offset || "150px",
        maskComposite: "exclude",
      } as React.CSSProperties
    }
    className={cn(
      "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
      "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
      "[background-size:var(--width)_var(--height)]",
      "[mask:linear-gradient(to_top,white_var(--fade-stop),transparent),_linear-gradient(to_bottom,white_var(--fade-stop),transparent),_linear-gradient(black,black)]",
      "[mask-composite:exclude]",
      "z-30",
      className,
    )}
  />
);

export default ThreeDMarquee;
