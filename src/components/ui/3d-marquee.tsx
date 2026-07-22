import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { ArrowUpRight } from "lucide-react";

export interface HexTorqCardItem {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  tier: "Premium" | "High";
  tech: string[];
  snippet: {
    filename: string;
    lang: string;
    code: string[];
  };
  price: string;
  originalPrice: string;
  discount: string;
}

const DEFAULT_HEXTORQ_CARDS: HexTorqCardItem[] = [
  {
    id: "h1",
    title: "Privacy-Preserving Federated Analytics in Healthcare",
    category: "AI / ML & Data Science",
    categoryColor: "#38bdf8",
    tier: "Premium",
    tech: ["TensorFlow", "Federated ML", "FastAPI", "Python"],
    snippet: {
      filename: "federated_model.py",
      lang: "Python",
      code: [
        "class FederatedTrainer(tf.keras.Model):",
        "  def compute_gradients(self, data):",
        "    grads = self.local_opt.gradient(loss)",
        "    return self.secure_aggregate(grads)",
      ],
    },
    price: "₹6,500",
    originalPrice: "₹7,000",
    discount: "7%",
  },
  {
    id: "h2",
    title: "Decentralized Voting System with Zero-Knowledge Proofs",
    category: "Blockchain & Web3",
    categoryColor: "#a855f7",
    tier: "Premium",
    tech: ["Solidity", "ZK-Snarks", "Hardhat", "Ethers.js"],
    snippet: {
      filename: "VoteVerifier.sol",
      lang: "Solidity",
      code: [
        "contract VoteVerifier is IZKVerifier {",
        "  function verifyVote(Proof memory p)",
        "    public returns (bool verified) {",
        "      return Snark.verify(p.a, p.b, p.c);",
        "  }",
        "}",
      ],
    },
    price: "₹6,500",
    originalPrice: "₹7,000",
    discount: "7%",
  },
  {
    id: "h3",
    title: "Kubernetes Threat Monitoring via Extended BPF",
    category: "Cybersecurity & Cloud",
    categoryColor: "#f43f5e",
    tier: "Premium",
    tech: ["eBPF", "Go", "C++", "Kubernetes"],
    snippet: {
      filename: "probe.bpf.c",
      lang: "C",
      code: [
        "SEC(\"kprobe/sys_execve\")",
        "int trace_exec(struct pt_regs *ctx) {",
        "  u32 pid = bpf_get_current_pid_tgid();",
        "  events.perf_submit(ctx, &event, sizeof(e));",
        "}",
      ],
    },
    price: "₹6,500",
    originalPrice: "₹7,000",
    discount: "7%",
  },
  {
    id: "h4",
    title: "Smart Agriculture Edge ML with Raspberry Pi",
    category: "IoT & Embedded Systems",
    categoryColor: "#10b981",
    tier: "High",
    tech: ["Raspberry Pi", "TensorFlow Lite", "MQTT", "Python"],
    snippet: {
      filename: "edge_infer.py",
      lang: "Python",
      code: [
        "interpreter = tflite.Interpreter(model_path)",
        "interpreter.set_tensor(input_details[0]['index'], img)",
        "interpreter.invoke()",
        "irrigation_level = interpreter.get_tensor(...)",
      ],
    },
    price: "₹5,500",
    originalPrice: "₹6,000",
    discount: "8%",
  },
  {
    id: "h5",
    title: "Real-Time Sign Language Translation via Transformers",
    category: "AI / ML & Computer Vision",
    categoryColor: "#06b6d4",
    tier: "Premium",
    tech: ["MediaPipe", "PyTorch", "OpenCV", "Python"],
    snippet: {
      filename: "transformer_translator.py",
      lang: "Python",
      code: [
        "landmarks = mp_hands.process(frame)",
        "tokens = pose_encoder(landmarks)",
        "translated_text = transformer.decode(tokens)",
      ],
    },
    price: "₹6,500",
    originalPrice: "₹7,000",
    discount: "7%",
  },
  {
    id: "h6",
    title: "Full-Stack Microservices Platform for E-Governance",
    category: "Web Applications",
    categoryColor: "#f59e0b",
    tier: "High",
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    snippet: {
      filename: "governance-api.ts",
      lang: "TypeScript",
      code: [
        "export async function processCitizenRequest(req) {",
        "  const audit = await db.insert(auditTrail)...",
        "  return NextResponse.json({ status: 'Approved' });",
        "}",
      ],
    },
    price: "₹5,800",
    originalPrice: "₹6,500",
    discount: "10%",
  },
  {
    id: "h7",
    title: "Medical Image Segmentation using 3D U-Net Models",
    category: "AI & Healthcare",
    categoryColor: "#ec4899",
    tier: "Premium",
    tech: ["3D U-Net", "PyTorch", "DICOM", "Flask"],
    snippet: {
      filename: "unet3d.py",
      lang: "Python",
      code: [
        "class UNet3D(nn.Module):",
        "  def forward(self, x):",
        "    enc1 = self.encoder1(x)",
        "    return self.decoder(self.bottleneck(enc1))",
      ],
    },
    price: "₹6,500",
    originalPrice: "₹7,000",
    discount: "7%",
  },
  {
    id: "h8",
    title: "Automated CI/CD Vulnerability Scanner & LLM Repair",
    category: "DevOps & Security",
    categoryColor: "#3b82f6",
    tier: "Premium",
    tech: ["Docker", "LLMs", "Python", "GitHub Actions"],
    snippet: {
      filename: "scanner.py",
      lang: "Python",
      code: [
        "ast_tree = parse_codebase(source_path)",
        "vulnerabilities = static_analyzer.scan(ast_tree)",
        "fixed_patch = llm_engine.generate_patch(vulnerabilities)",
      ],
    },
    price: "₹6,500",
    originalPrice: "₹7,000",
    discount: "7%",
  },
  {
    id: "h9",
    title: "Multi-Tenant Cloud Threat Detection utilizing DPI",
    category: "Cloud Security",
    categoryColor: "#8b5cf6",
    tier: "High",
    tech: ["Python", "AWS", "Packet Inspection", "Elasticsearch"],
    snippet: {
      filename: "dpi_analyzer.py",
      lang: "Python",
      code: [
        "def analyze_stream(packet_stream):",
        "  signatures = load_threat_signatures()",
        "  return detector.match_payload(packet_stream, signatures)",
      ],
    },
    price: "₹5,900",
    originalPrice: "₹6,400",
    discount: "8%",
  },
  {
    id: "h10",
    title: "Automated Market Maker & Yield Aggregator Protocol",
    category: "FinTech & Web3",
    categoryColor: "#f59e0b",
    tier: "Premium",
    tech: ["Solidity", "Chainlink", "Ethers.js", "React"],
    snippet: {
      filename: "YieldAggregator.sol",
      lang: "Solidity",
      code: [
        "function rebalancePools() external onlyOwner {",
        "  uint256 bestYield = getOptimalStrategy();",
        "  vault.deposit(bestYield);",
        "}",
      ],
    },
    price: "₹6,500",
    originalPrice: "₹7,000",
    discount: "7%",
  },
  {
    id: "h11",
    title: "Domain RAG QA System with Vector Embeddings",
    category: "AI & NLP",
    categoryColor: "#14b8a6",
    tier: "High",
    tech: ["LangChain", "Pinecone", "Python", "FastAPI"],
    snippet: {
      filename: "rag_chain.py",
      lang: "Python",
      code: [
        "docs = vectorstore.similarity_search(user_query, k=4)",
        "prompt = build_context_prompt(docs, user_query)",
        "response = llm.generate(prompt)",
      ],
    },
    price: "₹5,700",
    originalPrice: "₹6,200",
    discount: "8%",
  },
  {
    id: "h12",
    title: "Autonomous Drone Navigation using ROS2 & SLAM",
    category: "Robotics & Autonomous",
    categoryColor: "#ef4444",
    tier: "Premium",
    tech: ["ROS2", "C++", "Gazebo", "SLAM"],
    snippet: {
      filename: "nav2_planner.cpp",
      lang: "C++",
      code: [
        "void NavigationNode::cmdVelCallback(const Twist::SharedPtr msg) {",
        "  slam_map.updateOccupancyGrid(msg->linear, msg->angular);",
        "}",
      ],
    },
    price: "₹6,500",
    originalPrice: "₹7,000",
    discount: "7%",
  },
];

export const ThreeDMarquee = ({
  images,
  cards,
  className,
}: {
  images?: string[];
  cards?: HexTorqCardItem[];
  className?: string;
}) => {
  const itemsList = cards || DEFAULT_HEXTORQ_CARDS;
  const chunkSize = Math.ceil(itemsList.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return itemsList.slice(start, start + chunkSize);
  });

  return (
    <div
      className={cn(
        "mx-auto block h-[550px] sm:h-[620px] overflow-hidden rounded-3xl select-none relative w-full",
        className
      )}
      style={{ perspective: "1000px" }}
    >
      <div className="flex size-full items-center justify-center relative">
        <div
          className="shrink-0 scale-75 sm:scale-90 lg:scale-100 transition-transform duration-500"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            style={{
              transform: "rotateX(42deg) rotateY(0deg) rotateZ(-32deg)",
              transformStyle: "preserve-3d",
            }}
            className="grid grid-cols-4 gap-6 sm:gap-8 origin-center"
          >
            {chunks.map((subarray, colIndex) => (
              <motion.div
                animate={{ y: colIndex % 2 === 0 ? 80 : -80 }}
                transition={{
                  duration: colIndex % 2 === 0 ? 18 : 24,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                key={colIndex + "marquee"}
                className="flex flex-col items-start gap-6 sm:gap-8"
                style={{ transformStyle: "preserve-3d" }}
              >
                {subarray.map((item, itemIndex) => (
                  <div className="relative" key={itemIndex + item.id}>
                    {/* Render standard image fallback if images prop was passed */}
                    {images && images.length > 0 && typeof item === "string" ? (
                      <motion.img
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        src={item}
                        alt={`Preview ${itemIndex + 1}`}
                        className="w-[340px] sm:w-[400px] aspect-[970/650] rounded-xl object-cover ring ring-line/20 shadow-2xl"
                      />
                    ) : (
                      /* Render HexTorq Project Visual Card */
                      <motion.div
                        whileHover={{ y: -12, scale: 1.04, z: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-[340px] sm:w-[400px] rounded-2xl bg-surface/95 border border-line/80 p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-cyan/60 hover:shadow-cyan/30 transition-all duration-300 relative"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {/* Glowing top line accent */}
                        <div
                          className="absolute top-0 left-0 w-full h-[3px] opacity-90"
                          style={{ backgroundColor: item.categoryColor }}
                        />

                        {/* Top Metadata Header */}
                        <div className="flex items-center justify-between gap-2 z-10 mb-2">
                          <div className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap min-w-0">
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: item.categoryColor }}
                            />
                            <span className="text-muted text-[11px] font-medium uppercase tracking-wider truncate">
                              {item.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              Viva Ready
                            </span>
                            <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                              {item.tier}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="font-display text-xs sm:text-sm font-bold text-fg line-clamp-2 leading-snug my-1 z-10 group-hover:text-cyan transition-colors">
                          {item.title}
                        </h4>

                        {/* Code Editor Snippet Box */}
                        <div className="rounded-xl border border-line/60 bg-bg/95 p-3 font-mono text-[10.5px] leading-relaxed text-muted/90 overflow-hidden relative shadow-inner my-2">
                          <div className="flex items-center justify-between border-b border-line/40 pb-1.5 mb-1.5 select-none">
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
                          <div className="space-y-0.5 font-mono">
                            {item.snippet.code.map((line, lIdx) => (
                              <div key={lIdx} className="flex gap-2 min-w-0">
                                <span className="text-muted/40 select-none text-[9.5px] w-3 shrink-0">
                                  {lIdx + 1}
                                </span>
                                <span className="truncate text-fg/90">
                                  {line}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Tags & Pricing Footer */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-line/50 z-10">
                          {/* Tech Pills */}
                          <div className="flex items-center gap-1 overflow-hidden">
                            {item.tech.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-surface-hi/90 border border-line/70 px-2 py-0.5 text-[10px] text-muted font-medium shrink-0 whitespace-nowrap"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* Price & Action */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-right leading-tight">
                              <div className="flex items-center gap-1 justify-end">
                                <span className="font-display font-bold text-fg text-xs sm:text-sm">
                                  {item.price}
                                </span>
                                <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                                  {item.discount} off
                                </span>
                              </div>
                            </div>
                            <div className="h-7 w-7 rounded-full bg-violet/15 border border-violet/30 flex items-center justify-center text-violet group-hover:bg-violet group-hover:text-white transition-colors">
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
