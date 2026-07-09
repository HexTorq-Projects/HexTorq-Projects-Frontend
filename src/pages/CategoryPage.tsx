import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal, BookOpen, LayoutGrid } from "lucide-react";
import { useProjects } from "@/api/catalog";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/Button";
import { categoryMeta } from "@/lib/constants";
import { Skeleton } from "@/components/ui/Skeleton";
import { useUiStore } from "@/store/useUiStore";
import { Reveal } from "@/components/motion/Reveal";

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const catName = name ? decodeURIComponent(name) : "";
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const ui = useUiStore();

  // Sync scroll on pagination
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const { data: projectsData, isLoading } = useProjects({
    category: catName,
    page,
  });

  if (!catName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-fg font-semibold">Category not found</h2>
          <Link to="/explore" className="text-violet underline mt-2 inline-block">
            Go to catalog
          </Link>
        </div>
      </div>
    );
  }

  const meta = categoryMeta(catName);

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-8 aurora grain">
      {/* Back Button */}
      <Reveal delay={0.05}>
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Link>
      </Reveal>

      {/* Hero Stream Header */}
      <Reveal delay={0.1}>
        <div
          className="relative overflow-hidden rounded-3xl border border-line/80 p-8 md:p-12 space-y-4"
          style={{
            background: `linear-gradient(135deg, var(--color-surface) 60%, ${meta.color}15)`,
          }}
        >
          {/* Glow node top right */}
          <div
            className="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-[90px] opacity-40"
            style={{ backgroundColor: meta.color }}
          />

          <div className="max-w-2xl space-y-3 relative z-10">
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: meta.color }}
            >
              Academic Stream
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-fg tracking-tight">
              {catName}
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              Browse and explore our curated final-year engineering and computer science projects 
              built specifically for the {catName} discipline. Every project is fully verified.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link to={`/explore?category=${encodeURIComponent(catName)}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Advanced Filtering
              </Button>
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Grid Content */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-line pb-4 gap-4 flex-wrap">
          <h2 className="font-display font-bold text-xl text-fg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-txt" />
            Projects Catalogue
          </h2>
          <div className="flex items-center gap-4">
            {/* Density Toggle Buttons (Desktop only) */}
            <div className="hidden md:flex items-center gap-1 bg-bg border border-line rounded-lg p-0.5">
              {[2, 3, 4].map((cols) => (
                <button
                  key={cols}
                  onClick={() => ui.setGridColumns(cols)}
                  className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    ui.gridColumns === cols
                      ? "bg-surface-hi text-cyan-txt shadow-sm border border-line/50"
                      : "text-muted hover:text-fg border border-transparent"
                  }`}
                  title={`Set to ${cols} columns`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>{cols}C</span>
                </button>
              ))}
            </div>
            <span className="text-xs text-muted">
              {isLoading ? "Counting..." : `${projectsData?.total || 0} Projects Available`}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${
            ui.gridColumns === 2 ? "lg:grid-cols-2 xl:grid-cols-2" :
            ui.gridColumns === 4 ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-2 xl:grid-cols-3"
          }`}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex flex-col h-[340px] rounded-2xl bg-surface border border-line p-5 space-y-4"
              >
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-7 w-5/6" />
                <Skeleton className="h-20 w-full" />
                <div className="mt-auto pt-4 flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : !projectsData || projectsData.items.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-line rounded-2xl bg-surface/30">
            <h3 className="font-display font-semibold text-fg">No Projects Found</h3>
            <p className="text-muted text-sm mt-1">
              There are no projects loaded in this category yet.
            </p>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${
              ui.gridColumns === 2 ? "lg:grid-cols-2 xl:grid-cols-2" :
              ui.gridColumns === 4 ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-2 xl:grid-cols-3"
            }`}>
              {projectsData.items.map((project, idx) => (
                <Reveal key={project.id} delay={(idx % 6) * 0.04} className="h-full">
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>

            {/* Pagination */}
            {projectsData.pages > 1 && (
              <div className="flex items-center justify-between border-t border-line/40 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-xs text-muted">
                  Page {page} of {projectsData.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === projectsData.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
