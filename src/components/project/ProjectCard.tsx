import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/api/types";
import { Card } from "@/components/ui/Card";
import { TierBadge } from "./TierBadge";
import { ComplexityBadge } from "./ComplexityBadge";
import { PriceBlock } from "./PriceBlock";
import { CategoryPill } from "./CategoryPill";
import { WishlistButton } from "./WishlistButton";
import { splitList } from "@/lib/format";
import { categoryMeta } from "@/lib/constants";
import { useState } from "react";
import { BorderGlow } from "@/components/ui/BorderGlow";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export function ProjectCard({ project }: { project: Project }) {
  const techList = splitList(project.suggestedTech).slice(0, 3);
  const isPremium = project.sellabilityTier === "Premium";
  const catColor = categoryMeta(project.category?.categoryName).color;
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  const addToCart = useCartStore((s) => s.add);
  const inCart = useCartStore((s) => s.has(project.id));

  const content = (
    <>
      <Link to={`/project/${project.id}`} className="block h-full">
        <BorderGlow
          edgeSensitivity={30}
          glowColor={isPremium ? "#f5b944" : catColor}
          backgroundColor="var(--color-surface)"
          borderRadius={16}
          glowRadius={35}
          glowIntensity={isPremium ? 1.0 : 0.8}
          coneSpread={22}
          colors={isPremium ? ['#f59e0b', '#fbbf24', '#f472b6'] : [catColor, '#38bdf8', '#a855f7']}
          className="h-full group cursor-pointer"
        >
          <Card
            className={`flex flex-col h-full relative overflow-hidden transition-colors duration-350 border-0 bg-transparent ${isPremium ? "glow-premium" : ""}`}
            style={{}}
          >
            {/* Shine Overlay for Premium items */}
            {isPremium && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
                <div className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-amber-500/[0.08] to-transparent skew-x-[-20deg] animate-shine" />
              </div>
            )}

            {/* Top category bar indicator */}
            <div
              className="absolute top-0 left-0 w-full h-[3px] opacity-70 group-hover:opacity-100 transition-opacity z-10"
              style={{ backgroundColor: isPremium ? "#f5b944" : catColor }}
            />

            {/* Left category bar indicator */}
            <div
              className="absolute top-0 left-0 w-[3px] h-full opacity-40 group-hover:opacity-80 transition-opacity z-10"
              style={{ backgroundColor: isPremium ? "#f5b944" : catColor }}
            />

            {/* ── FIXED-HEIGHT SECTION: Category + Tier badges ── */}
            <div className="flex items-center justify-between gap-1.5 mb-3 pr-9 relative z-10 h-[24px] shrink-0">
              <span className="min-w-0 truncate">
                <CategoryPill name={project.category?.categoryName} short />
              </span>
              <TierBadge tier={project.sellabilityTier} />
            </div>

            {/* ── FIXED-HEIGHT SECTION: Title (exactly 2 lines worth of space) ── */}
            <h3
              className={`font-display text-[13px] sm:text-sm lg:text-base font-bold text-fg transition-colors mb-3 line-clamp-2 leading-snug relative z-10 h-[2.6rem] sm:h-[2.75rem] lg:h-[3rem] shrink-0 ${
                isPremium ? "group-hover:text-amber-500" : "group-hover:text-cyan"
              }`}
            >
              {project.projectTitle}
            </h3>

            {/* ── FIXED-HEIGHT SECTION: Tech Tags (single row, overflow faded) ── */}
            <div
              className="flex flex-nowrap gap-1.5 mb-3 relative z-10 overflow-hidden h-[24px] items-center shrink-0"
              style={{
                maskImage: "linear-gradient(to right, black 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, black 80%, transparent 100%)",
              }}
            >
              {techList.map((tech) => (
                <span
                  key={tech}
                  className={`whitespace-nowrap shrink-0 rounded-full border px-2 py-0.5 text-[11px] text-muted font-medium transition-colors ${
                    isPremium
                      ? "bg-amber-500/[0.02] border-amber-500/10 group-hover:border-amber-500/20"
                      : "bg-surface-hi border-line group-hover:border-line/80"
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* ── Spacer pushes divider+footer to bottom ── */}
            <div className="flex-1" />

            {/* Divider */}
            <div className="h-px bg-line/40 w-full mb-3 relative z-10 shrink-0" />

            {/* ── FIXED-HEIGHT SECTION: Footer (Complexity + Price) ── */}
            {/* pr-10 reserves space so PriceBlock never overlaps the absolute cart button */}
            <div className="flex items-center justify-between gap-2 pr-10 relative z-10 h-[36px] shrink-0">
              <div className="shrink-0">
                <ComplexityBadge complexity={project.complexity} />
              </div>
              <PriceBlock
                recommended={project.recommendedPrice}
                discounted={project.discountedPrice}
                original={project.originalPrice}
                size="sm"
              />
            </div>
          </Card>
        </BorderGlow>
      </Link>

      {/* Floating Wishlist Button — sits in the reserved gutter above, never over the tier badge */}
      <div className="absolute top-4 right-4 z-20">
        <WishlistButton project={project} />
      </div>
      <button
        type="button"
        onClick={() => addToCart(project)}
        className={`absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border shadow-lg transition-all ${inCart
            ? "border-emerald-500/40 bg-emerald-500 text-white"
            : "border-line bg-bg/90 text-muted hover:text-fg hover:border-cyan/60"
          }`}
        title={inCart ? "Added to cart" : "Add to cart"}
      >
        {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      </button>
    </>
  );

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  const transformClasses = "hover:-translate-y-1.5 hover:scale-[1.012] transition-all duration-350 ease-out";

  if (reduced) {
    return (
      <div className={`relative group h-full ${transformClasses}`} {...handlers}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      className={`relative group h-full ${transformClasses}`}
      {...handlers}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
}
export default ProjectCard;
