import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ArrowUpRight } from "lucide-react";
import marqueeData from "./marquee-data.json";

export interface HexTorqCardItem {
  id: string;
  /** Optional real project-preview screenshot (public/marquee/*.webp). */
  image?: string;
  title: string;
  category: string;
  categoryColor?: string;
  tier: "Premium" | "High" | string;
  tech: string[];
  price: string | null;
  originalPrice?: string | null;
  discount?: string | null;
  /** Legacy code-snippet fallback (used only when `image` is absent). */
  snippet?: {
    filename: string;
    lang: string;
    code: string[];
  };
}

/** Deterministic accent color per category so cards keep their colored spine
 *  even when the data comes from the API (which carries no color field). */
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
  { id: "h1", title: "Privacy-Preserving Federated Analytics in Healthcare", category: "AI/ML & Data Science", tier: "Premium", tech: ["TensorFlow", "Federated ML", "FastAPI"], price: "₹6,500", originalPrice: "₹7,000", discount: "7%", snippet: { filename: "federated_model.py", lang: "Python", code: ["class FederatedTrainer(tf.keras.Model):", "  def compute_gradients(self, data):", "    return self.secure_aggregate(grads)"] } },
  { id: "h2", title: "Decentralized Voting System with Zero-Knowledge Proofs", category: "Blockchain & Decentralized Systems", tier: "Premium", tech: ["Solidity", "ZK-Snarks", "Hardhat"], price: "₹6,500", originalPrice: "₹7,000", discount: "7%", snippet: { filename: "VoteVerifier.sol", lang: "Solidity", code: ["contract VoteVerifier is IZKVerifier {", "  function verifyVote(Proof memory p)", "    public returns (bool verified) {", "  }", "}"] } },
  { id: "h3", title: "Kubernetes Threat Monitoring via Extended BPF", category: "Cybersecurity & Cloud Security", tier: "Premium", tech: ["eBPF", "Go", "Kubernetes"], price: "₹6,500", originalPrice: "₹7,000", discount: "7%", snippet: { filename: "probe.bpf.c", lang: "C", code: ['SEC("kprobe/sys_execve")', "int trace_exec(struct pt_regs *ctx) {", "  u32 pid = bpf_get_current_pid_tgid();", "}"] } },
  { id: "h4", title: "Smart Agriculture Edge ML with Raspberry Pi", category: "IoT, Embedded & Robotics", tier: "High", tech: ["Raspberry Pi", "TF Lite", "MQTT"], price: "₹5,500", originalPrice: "₹6,000", discount: "8%", snippet: { filename: "edge_infer.py", lang: "Python", code: ["interpreter = tflite.Interpreter(model_path)", "interpreter.invoke()", "level = interpreter.get_tensor(...)"] } },
  { id: "h5", title: "Real-Time Sign Language Translation via Transformers", category: "AI/ML & Data Science", tier: "Premium", tech: ["MediaPipe", "PyTorch", "OpenCV"], price: "₹6,500", originalPrice: "₹7,000", discount: "7%", snippet: { filename: "translator.py", lang: "Python", code: ["landmarks = mp_hands.process(frame)", "tokens = pose_encoder(landmarks)", "text = transformer.decode(tokens)"] } },
  { id: "h6", title: "Full-Stack Microservices Platform for E-Governance", category: "Web Applications & Portals", tier: "High", tech: ["React", "TypeScript", "Node.js"], price: "₹5,800", originalPrice: "₹6,500", discount: "10%", snippet: { filename: "governance-api.ts", lang: "TypeScript", code: ["export async function process(req) {", "  const audit = await db.insert(...)", "  return json({ status: 'Approved' });", "}"] } },
  { id: "h7", title: "Medical Image Segmentation using 3D U-Net Models", category: "AI & Healthcare", tier: "Premium", tech: ["3D U-Net", "PyTorch", "DICOM"], price: "₹6,500", originalPrice: "₹7,000", discount: "7%", snippet: { filename: "unet3d.py", lang: "Python", code: ["class UNet3D(nn.Module):", "  def forward(self, x):", "    enc1 = self.encoder1(x)", "    return self.decoder(enc1)"] } },
  { id: "h8", title: "Automated CI/CD Vulnerability Scanner & LLM Repair", category: "Cybersecurity & Cloud Security", tier: "Premium", tech: ["Docker", "LLMs", "Python"], price: "₹6,500", originalPrice: "₹7,000", discount: "7%", snippet: { filename: "scanner.py", lang: "Python", code: ["ast_tree = parse_codebase(source_path)", "vulns = static_analyzer.scan(ast_tree)", "patch = llm_engine.generate_patch(vulns)"] } },
  { id: "h9", title: "Multi-Tenant Cloud Threat Detection utilizing DPI", category: "Cybersecurity & Cloud Security", tier: "High", tech: ["Python", "AWS", "Elasticsearch"], price: "₹5,900", originalPrice: "₹6,400", discount: "8%", snippet: { filename: "dpi_analyzer.py", lang: "Python", code: ["def analyze_stream(packet_stream):", "  sigs = load_threat_signatures()", "  return detector.match(packet_stream, sigs)"] } },
  { id: "h10", title: "Automated Market Maker & Yield Aggregator Protocol", category: "Blockchain & Decentralized Systems", tier: "Premium", tech: ["Solidity", "Chainlink", "React"], price: "₹6,500", originalPrice: "₹7,000", discount: "7%", snippet: { filename: "YieldAggregator.sol", lang: "Solidity", code: ["function rebalancePools() external {", "  uint256 best = getOptimalStrategy();", "  vault.deposit(best);", "}"] } },
  { id: "h11", title: "Domain RAG QA System with Vector Embeddings", category: "AI/ML & Data Science", tier: "High", tech: ["LangChain", "Pinecone", "FastAPI"], price: "₹5,700", originalPrice: "₹6,200", discount: "8%", snippet: { filename: "rag_chain.py", lang: "Python", code: ["docs = vectorstore.similarity_search(q, k=4)", "prompt = build_context_prompt(docs, q)", "response = llm.generate(prompt)"] } },
  { id: "h12", title: "Autonomous Drone Navigation using ROS2 & SLAM", category: "Robotics & Autonomous", tier: "Premium", tech: ["ROS2", "C++", "SLAM"], price: "₹6,500", originalPrice: "₹7,000", discount: "7%", snippet: { filename: "nav2_planner.cpp", lang: "C++", code: ["void NavigationNode::cmdVelCallback(msg) {", "  slam_map.updateOccupancyGrid(msg);", "}"] } },
];

const DATA_CARDS = marqueeData as HexTorqCardItem[];

/** Per-column continuous scroll speed (seconds for a full loop). Even columns
 *  scroll up, odd columns scroll down, so the field feels alive in both axes. */
const COLUMN_DURATION = [30, 36, 33, 39];

// ── One project card ──────────────────────────────────────────────────────
function MarqueeCard({ item }: { item: HexTorqCardItem }) {
  const accent = accentFor(item);
  const hasImage = Boolean(item.image);

  // Real-screenshot variant: image-forward product card. The preview already
  // shows the category + title, so the chrome is just badges + a price bar —
  // no duplicated title text.
  if (hasImage) {
    return (
      <div
        className="w-[300px] sm:w-[340px] rounded-2xl bg-surface border border-line/80 shadow-2xl flex flex-col overflow-hidden group hover:border-cyan/60 transition-colors duration-300 relative"
        style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
      >
        {/* Glowing top accent line */}
        <div
          className="absolute top-0 left-0 w-full h-[3px] opacity-90 z-20"
          style={{ backgroundColor: accent }}
        />

        {/* Real project screenshot (shows category + title from the live page) */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-bg-soft border-b border-line/60">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover object-top select-none"
          />
          {/* Badges overlaid top-right, like a real store card */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
            <span className="rounded-full bg-emerald-500/20 backdrop-blur border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              Viva Ready
            </span>
            <span className="rounded-full bg-amber-500/20 backdrop-blur border border-amber-400/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              {item.tier}
            </span>
          </div>
          {/* Fade the shot into the footer so the card reads as one surface */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
        </div>

        {/* Footer: tech chips + price */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-hidden">
            {item.tech.slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-full bg-surface-hi border border-line/70 px-2 py-0.5 text-[10px] text-muted font-medium shrink-0 whitespace-nowrap max-w-[92px] truncate"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {item.price && (
              <div className="flex flex-col items-end leading-none">
                <div className="flex items-center gap-1">
                  <span className="font-display font-bold text-fg text-sm">{item.price}</span>
                  {item.discount && (
                    <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-500">
                      {item.discount} off
                    </span>
                  )}
                </div>
                {item.originalPrice && item.originalPrice !== item.price && (
                  <span className="text-[10px] text-muted/70 line-through">{item.originalPrice}</span>
                )}
              </div>
            )}
            <div className="h-7 w-7 rounded-full bg-violet/15 border border-violet/30 flex items-center justify-center text-violet group-hover:bg-violet group-hover:text-white transition-colors">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback variant: designed code-snippet card (used only when no screenshot).
  return (
    <div
      className="w-[300px] sm:w-[340px] rounded-2xl bg-surface border border-line/80 shadow-2xl flex flex-col overflow-hidden group hover:border-cyan/60 transition-colors duration-300 relative"
      style={{
        // Keep text/images crisp through the parent 3D transform.
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Glowing top accent line */}
      <div
        className="absolute top-0 left-0 w-full h-[3px] opacity-90 z-20"
        style={{ backgroundColor: accent }}
      />

      <div className="p-4 sm:p-4.5 flex flex-col gap-2.5">
        {/* Category + Tier row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <span className="text-muted text-[11px] font-medium uppercase tracking-wider truncate">
              {item.category}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
              Viva Ready
            </span>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-500">
              {item.tier}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-display text-sm font-bold text-fg line-clamp-2 leading-snug group-hover:text-cyan transition-colors">
          {item.title}
        </h4>

        {/* Code snippet */}
        {item.snippet && (
          <div className="rounded-xl border border-line/60 bg-bg p-3 font-mono text-[10.5px] leading-relaxed overflow-hidden shadow-inner">
            <div className="flex items-center justify-between border-b border-line/40 pb-1.5 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500/80" />
                <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-muted/70 pl-1 font-sans font-medium">
                  {item.snippet.filename}
                </span>
              </div>
              <span className="text-[9px] uppercase font-sans text-cyan font-bold px-1.5 py-0.5 rounded bg-cyan/10 border border-cyan/20">
                {item.snippet.lang}
              </span>
            </div>
            <div className="space-y-0.5">
              {item.snippet.code.map((line, i) => (
                <div key={i} className="flex gap-2 min-w-0">
                  <span className="text-muted/40 select-none text-[9.5px] w-3 shrink-0">{i + 1}</span>
                  <span className="truncate text-fg/90">{line}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer: tech + price */}
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-line/50">
          <div className="flex items-center gap-1 overflow-hidden">
            {item.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-surface-hi border border-line/70 px-2 py-0.5 text-[10px] text-muted font-medium shrink-0 whitespace-nowrap"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {item.price && (
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-fg text-sm">{item.price}</span>
                {item.discount && (
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-500">
                    {item.discount} off
                  </span>
                )}
              </div>
            )}
            <div className="h-7 w-7 rounded-full bg-violet/15 border border-violet/30 flex items-center justify-center text-violet group-hover:bg-violet group-hover:text-white transition-colors">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── One continuously scrolling column ─────────────────────────────────────
function MarqueeColumn({
  items,
  duration,
  direction,
  animate,
}: {
  items: HexTorqCardItem[];
  duration: number;
  direction: "up" | "down";
  animate: boolean;
}) {
  // Duplicate the deck so the -50% translate loops seamlessly.
  const loop = [...items, ...items];
  const distance = direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"];

  return (
    <div className="flex flex-col gap-6 sm:gap-8" style={{ transformStyle: "preserve-3d" }}>
      <motion.div
        className="flex flex-col gap-6 sm:gap-8"
        animate={animate ? { y: distance } : undefined}
        transition={
          animate
            ? { duration, repeat: Infinity, ease: "linear", repeatType: "loop" }
            : undefined
        }
        style={{ transformStyle: "preserve-3d" }}
      >
        {loop.map((item, i) => (
          <MarqueeCard key={`${item.id}-${i}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

export const ThreeDMarquee = ({
  cards,
  className,
}: {
  /** Optional override; defaults to real screenshot data, then fallback deck. */
  cards?: HexTorqCardItem[];
  className?: string;
}) => {
  const reduced = useReducedMotion();
  const source = cards && cards.length > 0 ? cards : DATA_CARDS.length > 0 ? DATA_CARDS : FALLBACK_CARDS;

  // Split into 4 balanced columns (round-robin keeps each column full).
  const columns: HexTorqCardItem[][] = [[], [], [], []];
  source.forEach((item, i) => columns[i % 4].push(item));

  return (
    <div
      className={cn(
        "mx-auto block h-[560px] sm:h-[640px] overflow-hidden rounded-3xl select-none relative w-full",
        className
      )}
      style={{ perspective: "1400px" }}
    >
      {/* Edge fade so cards dissolve at the frame instead of hard-clipping. */}
      <div className="pointer-events-none absolute inset-0 z-20 [mask-image:radial-gradient(ellipse_at_center,transparent_55%,black_100%)]" />

      <div className="flex size-full items-center justify-center">
        <div
          className="shrink-0 scale-[0.62] sm:scale-75 lg:scale-90 xl:scale-100 transition-transform duration-500"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            style={{
              transform: "rotateX(38deg) rotateY(0deg) rotateZ(-28deg)",
              transformStyle: "preserve-3d",
            }}
            className="grid grid-cols-4 gap-6 sm:gap-8 origin-center"
          >
            {columns.map((col, i) => (
              <MarqueeColumn
                key={i}
                items={col}
                duration={COLUMN_DURATION[i]}
                direction={i % 2 === 0 ? "up" : "down"}
                animate={!reduced}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDMarquee;
