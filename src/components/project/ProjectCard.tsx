import { Link } from "react-router-dom";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import type { Project } from "@/api/types";
import { TierBadge } from "./TierBadge";
import { ComplexityBadge } from "./ComplexityBadge";
import { PriceBlock } from "./PriceBlock";
import { CategoryPill } from "./CategoryPill";
import { WishlistButton } from "./WishlistButton";
import { splitList } from "@/lib/format";
import { categoryMeta } from "@/lib/constants";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useFlyingCartStore } from "@/store/useFlyingCartStore";

export function ProjectCard({ project }: { project: Project }) {
  const techList = splitList(project.suggestedTech).slice(0, 3);
  const isPremium = project.sellabilityTier === "Premium";
  const catColor = categoryMeta(project.category?.categoryName).color;
  const reduced = useReducedMotion();
  const addToCart = useCartStore((s) => s.add);
  const removeFromCart = useCartStore((s) => s.remove);
  const inCart = useCartStore((s) => s.has(project.id));
  const triggerFly = useFlyingCartStore((s) => s.triggerFly);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCart) {
      removeFromCart(project.id);
    } else {
      addToCart(project);

      // Trigger Flying Particle Animation
      const rect = e.currentTarget.getBoundingClientRect();
      triggerFly({
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
        title: project.projectTitle,
        tier: project.sellabilityTier ?? undefined,
        color: isPremium ? "#f5b944" : catColor || "#38bdf8",
      });
    }
  };

  const cardContent = (
    <div
      className={`group relative flex flex-col justify-between h-full rounded-2xl border transition-all duration-250 backdrop-blur-md p-4 sm:p-5 overflow-hidden ${
        isPremium
          ? "bg-gradient-to-b from-amber-500/[0.03] to-[#131722]/95 border-amber-500/30 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5"
          : "bg-[#131722]/95 border-white/[0.08] hover:border-white/[0.18] hover:shadow-xl hover:shadow-black/40"
      }`}
    >
      {/* Subtle top category hairline accent on hover */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: isPremium
            ? "linear-gradient(90deg, transparent, #f59e0b, transparent)"
            : `linear-gradient(90deg, transparent, ${catColor || "#38bdf8"}, transparent)`,
        }}
      />

      {/* ── TOP SECTION: Header + Title + Tags ── */}
      <div>
        {/* Top row: Category on left, Premium badge near right, Heart at far right */}
        <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <CategoryPill name={project.category?.categoryName} short />
            {isPremium && <TierBadge tier={project.sellabilityTier} />}
          </div>
          <div className="shrink-0">
            <WishlistButton project={project} />
          </div>
        </div>

        {/* Title: Fixed-height 3-line area with clean ellipsis */}
        <Link to={`/project/${project.id}`} className="block group/title">
          <div className="h-[4.25rem] mb-2.5 flex items-start overflow-hidden">
            <h3
              title={project.projectTitle}
              className="font-display text-sm sm:text-[15px] font-bold text-fg leading-snug tracking-tight line-clamp-3 group-hover/title:text-cyan transition-colors"
            >
              {project.projectTitle}
            </h3>
          </div>
        </Link>

        {/* Technology tags: compact pills in single row */}
        <div className="flex items-center gap-1.5 h-6 mb-3 overflow-hidden">
          {techList.map((tech) => (
            <span
              key={tech}
              className="whitespace-nowrap rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-muted truncate max-w-[120px]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* ── BOTTOM SECTION: Divider + Pricing + Full-Width Cart Button ── */}
      <div className="mt-auto pt-1">
        {/* Subtle divider */}
        <div className="h-px bg-white/[0.06] w-full mb-3.5" />

        {/* Pricing row: Difficulty badge on left, Price + 7% OFF + Old Price on right */}
        <div className="flex items-center justify-between gap-2 mb-3.5 min-w-0">
          <div className="shrink-0">
            <ComplexityBadge complexity={project.complexity} />
          </div>
          <div className="shrink-0 min-w-0">
            <PriceBlock
              recommended={project.recommendedPrice}
              discounted={project.discountedPrice}
              original={project.originalPrice}
              size="sm"
            />
          </div>
        </div>

        {/* Full-width Add to Cart button */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="w-full"
        >
          <motion.button
            type="button"
            onClick={handleCartClick}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className={`w-full h-10 flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
              inCart
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 shadow-emerald-500/20"
                : "bg-surface-hi/90 hover:bg-surface-hi border border-line hover:border-violet/40 text-fg hover:text-white"
            }`}
            aria-label={inCart ? "In Cart - Click to remove" : "Add to Cart"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {inCart ? (
                <motion.span
                  key="incart"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  className="flex items-center gap-1.5 text-emerald-100 font-semibold"
                >
                  <Check className="h-4 w-4 text-emerald-300 stroke-[2.5]" />
                  <span>In Cart</span>
                </motion.span>
              ) : (
                <motion.span
                  key="addtocart"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  className="flex items-center gap-1.5 text-fg font-medium"
                >
                  <ShoppingCart className="h-4 w-4 text-muted group-hover:text-cyan transition-colors" />
                  <span>Add to Cart</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );

  const transformClasses = "h-full hover:-translate-y-1 transition-transform duration-250 ease-out";

  if (reduced) {
    return <div className={transformClasses}>{cardContent}</div>;
  }

  return (
    <motion.div
      className={transformClasses}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {cardContent}
    </motion.div>
  );
}

export default ProjectCard;
