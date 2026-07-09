import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Flame } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { Project } from "@/api/types";
import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/Button";

interface FeaturedCarouselProps {
  projects: Project[];
}

export function FeaturedCarousel({ projects }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      const t = setTimeout(checkScroll, 500);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        clearTimeout(t);
      };
    }
  }, [projects]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const offset = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: offset, behavior: reduced ? "auto" : "smooth" });
    }
  };

  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-20 mx-auto max-w-7xl px-4 md:px-8 space-y-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1 text-xs font-semibold text-amber-500 select-none">
            <Flame className="h-3.5 w-3.5 fill-current animate-bounce" />
            Trending Showcase
          </div>
          <h2 className="text-3xl font-bold font-display text-fg tracking-tight">
            Hot & Featured Deliverables
          </h2>
          <p className="text-sm text-muted max-w-lg">
            Our most frequently customized and highly reviewed project templates.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="rounded-full h-10 w-10 p-0 flex items-center justify-center border-line/65 hover:border-violet/40 transition-colors"
            aria-label="Scroll left"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="rounded-full h-10 w-10 p-0 flex items-center justify-center border-line/65 hover:border-violet/40 transition-colors"
            aria-label="Scroll right"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carousel container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory no-scrollbar scroll-smooth fade-scroll-b"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="w-[280px] sm:w-[350px] shrink-0 snap-start"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCarousel;
