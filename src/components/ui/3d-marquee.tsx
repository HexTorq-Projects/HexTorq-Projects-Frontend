import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import marqueeData from "./marquee-data.json";

export interface HexTorqCardItem {
  id: string;
  /** Real project-preview screenshot (public/marquee/*.webp). */
  image?: string;
  title: string;
  category: string;
  categoryColor?: string;
  tier: "Premium" | "High" | string;
  tech: string[];
  price: string | null;
  originalPrice?: string | null;
  discount?: string | null;
}

/** Deterministic accent color per category so each tile keeps a colored spine
 *  even though the API carries no color field. */
const CATEGORY_COLORS: Record<string, string> = {
  "AI/ML & Data Science": "#38bdf8",
  "AI & Healthcare": "#ec4899",
  "Web Applications & Portals": "#f59e0b",
  "Web Development": "#f59e0b",
  "IoT, Embedded & Robotics": "#10b981",
  "Cybersecurity & Cloud Security": "#f43f5e",
  "Blockchain & Decentralized Systems": "#a855f7",
  "Biomedical & Healthcare": "#f472b6",
  "Mobile Applications": "#06b6d4",
  "Networking & Wireless Communication": "#14b8a6",
  "Robotics & Autonomous": "#ef4444",
};

function accentFor(item: HexTorqCardItem): string {
  if (item.categoryColor) return item.categoryColor;
  if (CATEGORY_COLORS[item.category]) return CATEGORY_COLORS[item.category];
  let h = 0;
  for (let i = 0; i < item.category.length; i++)
    h = (h * 31 + item.category.charCodeAt(i)) % 360;
  return `hsl(${h}, 70%, 60%)`;
}

// ── Fallback deck (used only if marquee-data.json is empty, e.g. before the
// screenshot pipeline has run). Keeps the homepage functional at all times. ──
const FALLBACK_CARDS: HexTorqCardItem[] = [
  { id: "h1", title: "Privacy-Preserving Federated Analytics in Healthcare", category: "AI/ML & Data Science", tier: "Premium", tech: ["TensorFlow", "Federated ML"], price: "₹6,500" },
  { id: "h2", title: "Decentralized Voting System with Zero-Knowledge Proofs", category: "Blockchain & Decentralized Systems", tier: "Premium", tech: ["Solidity", "ZK-Snarks"], price: "₹6,500" },
  { id: "h3", title: "Kubernetes Threat Monitoring via Extended BPF", category: "Cybersecurity & Cloud Security", tier: "Premium", tech: ["eBPF", "Go"], price: "₹6,500" },
  { id: "h4", title: "Smart Agriculture Edge ML with Raspberry Pi", category: "IoT, Embedded & Robotics", tier: "High", tech: ["Raspberry Pi", "TF Lite"], price: "₹5,500" },
  { id: "h5", title: "Real-Time Sign Language Translation via Transformers", category: "AI/ML & Data Science", tier: "Premium", tech: ["MediaPipe", "PyTorch"], price: "₹6,500" },
  { id: "h6", title: "Full-Stack Microservices Platform for E-Governance", category: "Web Applications & Portals", tier: "High", tech: ["React", "Node.js"], price: "₹5,800" },
  { id: "h7", title: "Medical Image Segmentation using 3D U-Net Models", category: "AI & Healthcare", tier: "Premium", tech: ["3D U-Net", "PyTorch"], price: "₹6,500" },
  { id: "h8", title: "Automated CI/CD Vulnerability Scanner & LLM Repair", category: "Cybersecurity & Cloud Security", tier: "Premium", tech: ["Docker", "LLMs"], price: "₹6,500" },
  { id: "h9", title: "Multi-Tenant Cloud Threat Detection utilizing DPI", category: "Cybersecurity & Cloud Security", tier: "High", tech: ["Python", "AWS"], price: "₹5,900" },
  { id: "h10", title: "Automated Market Maker & Yield Aggregator Protocol", category: "Blockchain & Decentralized Systems", tier: "Premium", tech: ["Solidity", "Chainlink"], price: "₹6,500" },
  { id: "h11", title: "Domain RAG QA System with Vector Embeddings", category: "AI/ML & Data Science", tier: "High", tech: ["LangChain", "Pinecone"], price: "₹5,700" },
  { id: "h12", title: "Autonomous Drone Navigation using ROS2 & SLAM", category: "Robotics & Autonomous", tier: "Premium", tech: ["ROS2", "SLAM"], price: "₹6,500" },
];

const DATA_CARDS = marqueeData as HexTorqCardItem[];

/** Per-column loop time (seconds). Even columns drift up, odd columns down, so
 *  the whole floor feels alive on both axes. Slow = premium, not busy. */
const COLUMN_DURATION = [42, 54, 47, 60];

// ── One tile on the 3D floor: real project preview + slim caption ──────────
function MarqueeTile({ item }: { item: HexTorqCardItem }) {
  const accent = accentFor(item);
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative w-full overflow-hidden rounded-xl bg-[#0b1220] ring-1 ring-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
    >
      {/* Colored category spine */}
      <div className="absolute left-0 top-0 z-20 h-full w-[3px]" style={{ backgroundColor: accent }} />

      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
          width={800}
          height={500}
          className="aspect-[16/10] w-full select-none object-cover object-top"
        />
      ) : (
        // Graceful no-image fallback (only before the screenshot pipeline runs).
        <div className="flex aspect-[16/10] w-full flex-col justify-between bg-gradient-to-br from-[#111a2e] to-[#0b1220] p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: accent }}>
            {item.category}
          </span>
          <span className="font-display text-base font-bold leading-snug text-white/90 line-clamp-3">
            {item.title}
          </span>
        </div>
      )}

      {/* Caption bar: real title + price so it reads as a product card, not
          just a screenshot. Sits on a gradient so it's legible over the shot. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-4 pt-10">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
            <span className="truncate text-[11px] font-medium uppercase tracking-wider text-white/60">
              {item.category}
            </span>
          </div>
          <h4 className="line-clamp-1 font-display text-[15px] font-bold text-white">{item.title}</h4>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <span className="rounded-full border border-amber-400/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
            {item.tier}
          </span>
          {item.price && (
            <span className="mt-1 font-display text-base font-extrabold text-white">{item.price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── One column: continuous seamless vertical scroll ───────────────────────
function MarqueeColumn({
  items,
  duration,
  direction,
}: {
  items: HexTorqCardItem[];
  duration: number;
  direction: "up" | "down";
}) {
  // Duplicate the deck so the 50% translate loops with no visible seam.
  const loop = [...items, ...items];
  const distance = direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"];
  return (
    <motion.div
      className="flex flex-col gap-8"
      animate={{ y: distance }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <GridLineVertical className="-left-4" offset="80px" />
      {loop.map((item, i) => (
        <div key={`${item.id}-${i}`} className="relative">
          <GridLineHorizontal className="-top-4" offset="20px" />
          <MarqueeTile item={item} />
        </div>
      ))}
    </motion.div>
  );
}

export const ThreeDMarquee = ({
  cards,
  className,
}: {
  cards?: HexTorqCardItem[];
  className?: string;
}) => {
  const source =
    cards && cards.length > 0 ? cards : DATA_CARDS.length > 0 ? DATA_CARDS : FALLBACK_CARDS;

  // Repeat once for a denser floor, then round-robin into 4 balanced columns.
  const filled = [...source, ...source];
  const columns: HexTorqCardItem[][] = [[], [], [], []];
  filled.forEach((item, i) => columns[i % 4].push(item));

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
              // Orthographic tilt (NO perspective) → clean "receding floor" look.
              transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
              transformStyle: "preserve-3d",
            }}
            className="relative right-[50%] top-96 grid size-full origin-top-left grid-cols-4 gap-8"
          >
            {columns.map((col, i) => (
              <MarqueeColumn
                key={i}
                items={col}
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
