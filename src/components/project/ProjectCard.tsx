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
import { CargoDropButton } from "@/components/ui/CargoDropButton";
import { useCartStore } from "@/store/useCartStore";

export function ProjectCard({ project }: { project: Project }) {
  const techList = splitList(project.suggestedTech).slice(0, 3);
  const isPremium = project.sellabilityTier === "Premium";
  const catColor = categoryMeta(project.category?.categoryName).color;
  const reduced = useReducedMotion();
  const addToCart = useCartStore((s) => s.add);
  const inCart = useCartStore((s) => s.has(project.id));

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

      {/* ── BOTTOM SECTION: Divider + Pricing + Full-Width Cargo Drop Button ── */}
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

        {/* Full-width Add to Cart button row */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="w-full flex justify-center pt-0.5"
        >
          <CargoDropButton
            size="card"
            inCart={inCart}
            onAddToCart={() => {
              addToCart(project);
            }}
          />
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
