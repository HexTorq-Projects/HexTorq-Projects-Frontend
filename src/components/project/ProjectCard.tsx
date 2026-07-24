import { Link } from "react-router-dom";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import type { Project } from "@/api/types";
import { Card } from "@/components/ui/Card";
import { TierBadge } from "./TierBadge";
import { ComplexityBadge } from "./ComplexityBadge";
import { PriceBlock } from "./PriceBlock";
import { CategoryPill } from "./CategoryPill";
import { WishlistButton } from "./WishlistButton";
import { splitList } from "@/lib/format";
import { categoryMeta } from "@/lib/constants";
import { useState, useCallback } from "react";
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
  const removeFromCart = useCartStore((s) => s.remove);
  const inCart = useCartStore((s) => s.has(project.id));
  const [justAdded, setJustAdded] = useState(false);

  const handleCartClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (inCart) {
        removeFromCart(project.id);
      } else {
        addToCart(project);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1400);
      }
    },
    [inCart, project, addToCart, removeFromCart]
  );

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
            className={`flex flex-col h-full relative overflow-hidden transition-colors duration-350 border-0 bg-transparent p-3 sm:p-4 ${isPremium ? "glow-premium" : ""}`}
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

            {/* ── SECTION: Category + Tier badges ── */}
            <div className="flex items-center justify-between gap-1.5 mb-2 pr-8 relative z-10 shrink-0">
              <span className="min-w-0">
                <CategoryPill name={project.category?.categoryName} short />
              </span>
              <TierBadge tier={project.sellabilityTier} />
            </div>

            {/* ── SECTION: Title (no clamp — fully visible) ── */}
            <h3
              title={project.projectTitle}
              className={`font-display text-[11px] sm:text-xs font-bold text-fg transition-colors mb-2 leading-snug relative z-10 ${
                isPremium ? "group-hover:text-amber-500" : "group-hover:text-cyan"
              }`}
            >
              {project.projectTitle}
            </h3>

            {/* ── SECTION: Tech Tags (wrapping, fully visible) ── */}
            <div className="flex flex-wrap gap-1 mb-2 relative z-10">
              {techList.map((tech) => (
                <span
                  key={tech}
                  className={`whitespace-nowrap rounded-full border px-1.5 py-[1px] text-[10px] text-muted font-medium transition-colors ${
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
            <div className="h-px bg-line/40 w-full mb-2 relative z-10 shrink-0" />

            {/* ── SECTION: Footer (Complexity + Price + Cart) ── */}
            <div className="flex items-center justify-between gap-1.5 relative z-10 shrink-0">
              <div className="shrink-0">
                <ComplexityBadge complexity={project.complexity} />
              </div>
              <div className="flex items-center gap-1.5 shrink-0 min-w-0">
                <PriceBlock
                  recommended={project.recommendedPrice}
                  discounted={project.discountedPrice}
                  original={project.originalPrice}
                  size="sm"
                />
                {/* ── Cart Button ── */}
                <motion.button
                  type="button"
                  onClick={handleCartClick}
                  whileTap={{ scale: 0.82 }}
                  whileHover={{ scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 450, damping: 18 }}
                  className={`relative shrink-0 flex h-7.5 w-7.5 items-center justify-center rounded-full border shadow-lg z-20 transition-all duration-300 ${
                    inCart
                      ? "border-emerald-500/40 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30"
                      : "border-line bg-surface-hi text-muted hover:text-cyan hover:border-cyan/50 hover:shadow-cyan-500/20"
                  }`}
                  aria-label={inCart ? "Remove from cart" : "Add to cart"}
                >
                  {/* Ripple ring */}
                  <AnimatePresence>
                    {justAdded && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-emerald-400/50"
                        initial={{ scale: 0.2, opacity: 0.9 }}
                        animate={{ scale: 3.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                      />
                    )}
                  </AnimatePresence>
                  {/* Icon swap */}
                  <AnimatePresence mode="wait" initial={false}>
                    {inCart ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: 90, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20, mass: 0.4 }}
                        className="flex items-center justify-center"
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="cart"
                        initial={{ scale: 0, rotate: 90 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: -90, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20, mass: 0.4 }}
                        className="flex items-center justify-center"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </Card>
        </BorderGlow>
      </Link>

      {/* Floating Wishlist Button */}
      <div className="absolute top-3 right-3 z-20">
        <WishlistButton project={project} />
      </div>
    </>
  );

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  const transformClasses = "hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 ease-out";

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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  );
}
export default ProjectCard;
