import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Heart, Shield, Code, CheckCircle, Package, Sparkles } from "lucide-react";
import { useProject } from "@/api/catalog";
import { useUiStore } from "@/store/useUiStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlist, useAddWishlist, useRemoveWishlist } from "@/api/wishlist";
import { PriceBlock } from "@/components/project/PriceBlock";
import { TierBadge } from "@/components/project/TierBadge";
import { ComplexityBadge } from "@/components/project/ComplexityBadge";
import { CategoryPill } from "@/components/project/CategoryPill";
import { splitList } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Reveal } from "@/components/motion/Reveal";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, error } = useProject(id);

  const { openEnquiry, openAuth } = useUiStore();
  const { user } = useAuthStore();
  const { data: wishlist = [] } = useWishlist();

  const addWishlist = useAddWishlist();
  const removeWishlist = useRemoveWishlist();

  const isLiked = wishlist.some((p) => p.id === id);
  const wishlistPending = addWishlist.isPending || removeWishlist.isPending;

  const handleWishlistToggle = () => {
    if (!user) {
      openAuth("login");
      return;
    }
    if (!project || wishlistPending) return;

    if (isLiked) {
      removeWishlist.mutate(project.id);
    } else {
      addWishlist.mutate(project);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="h-[300px] bg-surface rounded-2xl border border-line" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-fg font-semibold">Project not found</h2>
          <Link to="/explore" className="text-violet underline mt-2 inline-block">
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  const techStack = splitList(project.suggestedTech);
  const modules = splitList(project.suggestedModules);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-8 aurora grain">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Text and specs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Header Info */}
          <Reveal delay={0.1}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <CategoryPill name={project.category?.categoryName} asLink />
                {project.applicationArea && (
                  <>
                    <span className="text-faint">•</span>
                    <Link
                      to={`/explore?applicationArea=${encodeURIComponent(
                        project.applicationArea.applicationAreaName
                      )}`}
                      className="text-xs text-muted hover:text-cyan font-medium transition-colors"
                    >
                      Domain: {project.applicationArea.applicationAreaName}
                    </Link>
                  </>
                )}
              </div>
              <h1 className="text-2xl md:text-3.5xl font-bold font-display tracking-tight text-fg leading-tight">
                {project.projectTitle}
              </h1>
            </div>
          </Reveal>

          {/* Description */}
          <Reveal delay={0.15}>
            <div className="space-y-5">
              <h3 className="text-lg font-bold font-display text-fg border-b border-line pb-2.5">
                Project Description
              </h3>
              {/* Lead brief — larger, high-contrast intro paragraph */}
              <p className="text-base md:text-lg leading-relaxed text-fg/90">
                {project.brief}
              </p>
              {project.detailed && (
                <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/40 p-5 pl-6">
                  {/* Accent spine */}
                  <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-violet via-indigo to-cyan" />
                  <p className="mb-2 flex items-center gap-2 font-display font-semibold text-fg">
                    <Sparkles className="h-4 w-4 text-violet" />
                    Detailed Overview
                  </p>
                  <p className="text-sm leading-relaxed text-muted">{project.detailed}</p>
                </div>
              )}
            </div>
          </Reveal>

          {/* Suggested Modules */}
          {modules.length > 0 && (
            <Reveal delay={0.2}>
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-fg border-b border-line pb-2.5">
                  Suggested System Modules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {modules.map((m, idx) => (
                    <div
                      key={idx}
                      className="group flex gap-3 items-start p-3.5 bg-bg-soft border border-line rounded-xl transition-all duration-300 hover:border-violet/50 hover:bg-surface-hi hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet/5 cursor-default"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0 transition-all group-hover:bg-emerald-500/20 group-hover:scale-110">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      </span>
                      <span className="text-xs text-fg font-medium leading-relaxed pt-0.5">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Suggested Tech Stack */}
          {techStack.length > 0 && (
            <Reveal delay={0.25}>
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-fg border-b border-line pb-2.5">
                  Recommended Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1.5 rounded-full bg-surface-hi border border-line px-3.5 py-1 text-xs text-muted"
                    >
                      <Code className="h-3.5 w-3.5 text-cyan" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* Right Side: Sticky Checkout Box */}
        <aside className="lg:sticky lg:top-24 space-y-6">
          <Reveal delay={0.2}>
            <div className="glass border border-line rounded-2xl p-6 space-y-6 shadow-xl bg-surface/40">
              {/* Badges / Status */}
              <div className="flex items-center justify-between">
                <TierBadge tier={project.sellabilityTier} />
                <ComplexityBadge complexity={project.complexity} />
              </div>

              {/* Pricing block */}
              <div className="space-y-1.5 border-b border-line pb-6">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Effective Catalog Price
                </span>
                <PriceBlock
                  recommended={project.recommendedPrice}
                  discounted={project.discountedPrice}
                  original={project.originalPrice}
                  size="lg"
                />
              </div>

              {/* Core Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={() => openEnquiry(project.id, project.projectTitle)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4.5 w-4.5 fill-current" />
                  Enquire via WhatsApp
                </Button>

                <Button
                  variant={isLiked ? "solid" : "outline"}
                  onClick={handleWishlistToggle}
                  disabled={wishlistPending}
                  className="w-full flex items-center justify-center gap-2 border-line hover:border-violet/40 text-fg"
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                  {isLiked ? "Saved to Wishlist" : "Save to Wishlist"}
                </Button>
              </div>

              {/* Deliverables Info List */}
              <div className="space-y-3 pt-2 text-xs text-muted border-t border-line/60">
                <div className="flex gap-2 items-start">
                  <Shield className="h-4 w-4 text-violet shrink-0 mt-0.5" />
                  <span>
                    <strong>Full source code</strong> handoff. Clean, commented files including database scripts.
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <Package className="h-4 w-4 text-cyan shrink-0 mt-0.5" />
                  <span>
                    <strong>Setup assistance</strong>. Remote installation and configuration on your system.
                  </span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Coaching & Viva help</strong>. Basic explanation of module connections and system flow.
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
