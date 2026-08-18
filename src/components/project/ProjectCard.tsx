import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/api/types";
import { TierBadge } from "./TierBadge";
import { ComplexityBadge } from "./ComplexityBadge";
import { PriceBlock } from "./PriceBlock";
import { CategoryPill } from "./CategoryPill";
import { WishlistButton } from "./WishlistButton";
import { splitList } from "@/lib/format";
import { categoryMeta } from "@/lib/constants";
import { useState } from "react";
import { CargoDropButton } from "@/components/ui/CargoDropButton";
import { useCartStore } from "@/store/useCartStore";
import { useFlyingCartStore } from "@/store/useFlyingCartStore";

export function ProjectCard({ project }: { project: Project }) {
  const techList = splitList(project.suggestedTech).slice(0, 3);
  const isPremium = project.sellabilityTier === "Premium";
  const catColor = categoryMeta(project.category?.categoryName).color;
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  const addToCart = useCartStore((s) => s.add);
  const removeFromCart = useCartStore((s) => s.remove);
  const inCart = useCartStore((s) => s.has(project.id));
  const triggerFly = useFlyingCartStore((s) => s.triggerFly);

  const cardContent = (
    <div
      className={`group relative flex flex-col justify-between h-full rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-md p-4 sm:p-5 ${
        isPremium
          ? "bg-[#131722]/90 border-amber-500/25 hover:border-amber-500/45 hover:shadow-lg hover:shadow-amber-500/5"
          : "bg-[#121620]/90 border-white/[0.08] hover:border-white/[0.18] hover:shadow-xl hover:shadow-black/40"
      }`}
    >
      {/* Subtle top category hairline accent on hover */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isPremium
            ? "linear-gradient(90deg, transparent, #f59e0b, transparent)"
            : `linear-gradient(90deg, transparent, ${catColor || "#38bdf8"}, transparent)`,
        }}
      />

      {/* ── TOP: Category + Tier + Wishlist ── */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <CategoryPill name={project.category?.categoryName} short />
            {isPremium && <TierBadge tier={project.sellabilityTier} />}
          </div>
          <div className="shrink-0">
            <WishlistButton project={project} />
          </div>
        </div>

        {/* ── TITLE: Consistent 3-line clamp with clean typography ── */}
        <Link to={`/project/${project.id}`} className="block group/title">
          <h3
            title={project.projectTitle}
            className="font-display text-sm sm:text-[15px] font-bold text-fg leading-snug tracking-tight mb-2.5 line-clamp-3 min-h-[3.9rem] sm:min-h-[4.2rem] group-hover/title:text-cyan transition-colors"
          >
            {project.projectTitle}
          </h3>
        </Link>

        {/* ── TECH TAGS: Clean micro badges ── */}
        <div className="flex flex-wrap gap-1.5 mb-3.5 max-h-[1.75rem] overflow-hidden">
          {techList.map((tech) => (
            <span
              key={tech}
              className="whitespace-nowrap rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-muted/90 truncate max-w-[130px]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* ── BOTTOM: Divider + Pricing + Action ── */}
      <div className="mt-auto pt-2">
        {/* Subtle Divider */}
        <div className="h-px bg-white/[0.06] w-full mb-3" />

        {/* Pricing + Difficulty Row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="shrink-0">
            <ComplexityBadge complexity={project.complexity} />
          </div>
          <div className="shrink-0">
            <PriceBlock
              recommended={project.recommendedPrice}
              discounted={project.discountedPrice}
              original={project.originalPrice}
              size="sm"
              align="right"
            />
          </div>
        </div>

        {/* Add to Cart / In Cart Action Button */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="w-full flex justify-center pt-1"
        >
          <CargoDropButton
            size="card"
            inCart={inCart}
            onAddToCart={() => {
              if (inCart) {
                removeFromCart(project.id);
              } else {
                addToCart(project);
                triggerFly({
                  startX: window.innerWidth / 2,
                  startY: window.innerHeight / 2,
                  title: project.projectTitle,
                  tier: project.sellabilityTier ?? undefined,
                  color: isPremium ? "#f5b944" : catColor || "#38bdf8",
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  const transformClasses = "h-full hover:-translate-y-1 transition-transform duration-250 ease-out";

  if (reduced) {
    return (
      <div className={transformClasses} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {cardContent}
      </div>
    );
  }

  return (
    <motion.div
      className={transformClasses}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
