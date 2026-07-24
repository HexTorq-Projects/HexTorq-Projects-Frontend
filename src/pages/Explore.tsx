import { useEffect, useMemo } from "react";
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
  Globe2,
  Award,
  Gauge,
  Wallet,
  LayoutGrid,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useFilterStore, selectFilters, activeFilterCount } from "@/store/useFilterStore";
import { useUiStore } from "@/store/useUiStore";
import { useReferralStore } from "@/store/useReferralStore";
import { useProjects, useCategories, useApplicationAreas } from "@/api/catalog";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Input } from "@/components/ui/Input";
import { TIER_ORDER, COMPLEXITY_ORDER, TIER_META, categoryMeta, appAreaColor } from "@/lib/constants";
import { Skeleton } from "@/components/ui/Skeleton";

function SidebarContent({
  store,
  categories,
  appAreas,
  activeCount,
}: {
  store: any;
  categories: any[];
  appAreas: any[];
  activeCount: number;
}) {
  return (
    <div className="space-y-6">
      {/* Active filters header */}
      <div className="flex lg:hidden items-center justify-between border-b border-line pb-4">
        <h3 className="font-display font-bold text-lg text-fg flex items-center gap-2">
          <SlidersHorizontal className="h-4.5 w-4.5 text-violet" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-violet/20 px-2 py-0.5 text-xs text-violet font-semibold">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={() => store.reset()}
            className="text-xs text-muted hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Search Field */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Search className="h-3.5 w-3.5 text-muted" />
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-faint" />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-9 h-11"
            value={store.search || ""}
            onChange={(e) => store.setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stream / Category */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-violet" />
          Stream / Category
        </label>
        <div
          className="space-y-1.5 max-h-48 overflow-y-auto pr-1 fade-scroll-b overscroll-y-contain"
          data-lenis-prevent
        >
          <button
            onClick={() => store.setCategory(undefined)}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all flex items-center justify-between ${
              !store.category ? "bg-violet/10 text-violet font-medium" : "text-muted hover:bg-surface-hi hover:text-fg hover:translate-x-0.5"
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => store.setCategory(cat.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all flex items-center justify-between gap-2 ${
                store.category === cat.name ? "bg-violet/10 text-violet font-medium" : "text-muted hover:bg-surface-hi hover:text-fg hover:translate-x-0.5"
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: categoryMeta(cat.name).color }}
                />
                <span className="truncate">{cat.name}</span>
              </span>
              <span className="text-xs font-semibold text-faint shrink-0">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Domain / Area */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Globe2 className="h-3.5 w-3.5 text-cyan" />
          Domain / Area
        </label>
        <div
          className="space-y-1.5 max-h-48 overflow-y-auto pr-1 fade-scroll-b overscroll-y-contain"
          data-lenis-prevent
        >
          <button
            onClick={() => store.setApplicationArea(undefined)}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all flex items-center justify-between ${
              !store.applicationArea ? "bg-violet/10 text-violet font-medium" : "text-muted hover:bg-surface-hi hover:text-fg hover:translate-x-0.5"
            }`}
          >
            <span>All Domains</span>
          </button>
          {appAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => store.setApplicationArea(area.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all flex items-center justify-between gap-2 ${
                store.applicationArea === area.name ? "bg-violet/10 text-violet font-medium" : "text-muted hover:bg-surface-hi hover:text-fg hover:translate-x-0.5"
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: appAreaColor(area.name) }}
                />
                <span className="truncate">{area.name}</span>
              </span>
              <span className="text-xs font-semibold text-faint shrink-0">{area.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sellability Tier */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-tier-premium" />
          Sellability Tier
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => store.setTier(undefined)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-all hover:scale-[1.04] ${
              !store.tier
                ? "bg-fg text-bg border-fg font-medium"
                : "border-line text-muted hover:border-violet/40 hover:text-fg"
            }`}
          >
            All
          </button>
          {TIER_ORDER.map((tier) => (
            <button
              key={tier}
              onClick={() => store.setTier(tier)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all hover:scale-[1.04] ${
                store.tier === tier
                  ? "bg-violet border-violet text-white font-medium"
                  : "border-line text-muted hover:border-violet/40 hover:text-fg"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Complexity */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Gauge className="h-3.5 w-3.5 text-emerald-400" />
          Complexity
        </label>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => store.setComplexity(undefined)}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
              !store.complexity ? "bg-violet/10 text-violet font-medium" : "text-muted hover:bg-surface-hi hover:text-fg hover:translate-x-0.5"
            }`}
          >
            All Complexities
          </button>
          {COMPLEXITY_ORDER.map((c) => (
            <button
              key={c}
              onClick={() => store.setComplexity(c)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                store.complexity === c ? "bg-violet/10 text-violet font-medium" : "text-muted hover:bg-surface-hi hover:text-fg hover:translate-x-0.5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5 text-muted" />
          Budget Range (₹)
        </label>
        <div className="flex gap-2.5 items-center">
          <Input
            type="number"
            placeholder="Min"
            value={store.minPrice || ""}
            onChange={(e) => store.setPrice(e.target.value ? Number(e.target.value) : undefined, store.maxPrice)}
            className="h-9 px-2.5 text-center text-xs"
          />
          <span className="text-muted text-xs">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={store.maxPrice || ""}
            onChange={(e) => store.setPrice(store.minPrice, e.target.value ? Number(e.target.value) : undefined)}
            className="h-9 px-2.5 text-center text-xs"
          />
        </div>
      </div>
    </div>
  );
}

export default function Explore() {
  const store = useFilterStore();
  const ui = useUiStore();
  const filters = selectFilters(store);
  const [searchParams] = useSearchParams();
  const setReferralCode = useReferralStore((s) => s.setCode);

  useEffect(() => {
    const category = searchParams.get("category");
    const tier = searchParams.get("tier");
    const search = searchParams.get("search");
    const applicationArea = searchParams.get("applicationArea");
    const complexity = searchParams.get("complexity");
    const ref = searchParams.get("ref");

    if (category) store.setCategory(category);
    if (tier) store.setTier(tier);
    if (search) store.setSearch(search);
    if (applicationArea) store.setApplicationArea(applicationArea);
    if (complexity) store.setComplexity(complexity);
    if (ref) setReferralCode(ref);
  }, []);

  // Queries: fetch all 10000 projects once at page load
  const { data: allProjectsData, isLoading: loadingProjects } = useProjects({ perPage: 10000 });
  const allItems = allProjectsData?.items || [];
  const isPlaceholderData = false;

  const { data: categories = [] } = useCategories();
  const { data: appAreas = [] } = useApplicationAreas();

  // Local filtering & pagination logic
  const filteredItems = useMemo(() => {
    let result = [...allItems];

    // 1. Search
    if (filters.search) {
      const query = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.projectTitle.toLowerCase().includes(query) ||
          (p.brief && p.brief.toLowerCase().includes(query)) ||
          (p.detailed && p.detailed.toLowerCase().includes(query)) ||
          (p.suggestedTech && p.suggestedTech.toLowerCase().includes(query))
      );
    }

    // 2. Category
    if (filters.category) {
      result = result.filter((p) => p.category?.categoryName === filters.category);
    }

    // 3. Application Area
    if (filters.applicationArea) {
      result = result.filter((p) => p.applicationArea?.applicationAreaName === filters.applicationArea);
    }

    // 4. Tier
    if (filters.tier) {
      result = result.filter((p) => p.sellabilityTier === filters.tier);
    }

    // 5. Complexity
    if (filters.complexity) {
      result = result.filter((p) => p.complexity === filters.complexity);
    }

    // 6. Price range
    const minP = filters.minPrice != null ? Number(filters.minPrice) : null;
    const maxP = filters.maxPrice != null ? Number(filters.maxPrice) : null;
    if (minP !== null && !isNaN(minP)) {
      result = result.filter((p) => (p.recommendedPrice ?? p.discountedPrice ?? 0) >= minP);
    }
    if (maxP !== null && !isNaN(maxP)) {
      result = result.filter((p) => (p.recommendedPrice ?? p.discountedPrice ?? 0) <= maxP);
    }

    // 7. Sort
    result.sort((a, b) => {
      if (filters.sort === "price_asc") {
        const pa = a.recommendedPrice ?? a.discountedPrice ?? 0;
        const pb = b.recommendedPrice ?? b.discountedPrice ?? 0;
        return pa - pb;
      } else if (filters.sort === "price_desc") {
        const pa = a.recommendedPrice ?? a.discountedPrice ?? 0;
        const pb = b.recommendedPrice ?? b.discountedPrice ?? 0;
        return pb - pa;
      } else if (filters.sort === "newest") {
        return new Date(b.rowCreatedTime || 0).getTime() - new Date(a.rowCreatedTime || 0).getTime();
      } else {
        // default / importanceScore
        return (b.importanceScore ?? 0) - (a.importanceScore ?? 0);
      }
    });

    return result;
  }, [allItems, filters]);

  // 8. Pagination local slicing
  const itemsPerPage = 20;
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.max(1, Math.min(totalPages, filters.page || 1));

  const paginatedItems = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredItems, currentPage]);

  const projectsData = {
    items: paginatedItems,
    total: totalItems,
    page: currentPage,
    perPage: itemsPerPage,
    pages: totalPages,
  };

  // Reset page if filters change
  const activeCount = activeFilterCount(filters);

  // Sync scroll on pagination
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.page]);

  const handlePrevPage = () => store.setPage(Math.max(1, currentPage - 1));
  const handleNextPage = () => store.setPage(Math.min(totalPages, currentPage + 1));

  /** Page numbers to render, collapsing long gaps with an ellipsis. */
  const buildPageList = (current: number, total: number): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    for (let p = 1; p <= total; p++) {
      if (p === 1 || p === total || (p >= current - 1 && p <= current + 1)) {
        pages.push(p);
      } else if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis");
      }
    }
    return pages;
  };

  const getGridColsClass = () => {
    switch (ui.gridColumns) {
      case 2:
        return "lg:grid-cols-2 xl:grid-cols-2";
      case 4:
        return "lg:grid-cols-3 xl:grid-cols-4";
      case 3:
      default:
        return "lg:grid-cols-2 xl:grid-cols-3";
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto aurora grain">
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Left Column: Desktop Sidebar Filter (Hidden on Mobile) — stays pinned on screen while the grid scrolls */}
        <motion.aside
          layout
          className={`hidden lg:block shrink-0 glass border border-line rounded-2xl self-start lg:sticky lg:top-24 lg:max-h-[calc(100vh-6.5rem)] overflow-hidden transition-all duration-300 ${
            ui.filterPanelCollapsed ? "w-16 p-4 flex flex-col items-center gap-6" : "w-72 p-6 overflow-y-auto overscroll-y-contain"
          }`}
          data-lenis-prevent={!ui.filterPanelCollapsed ? "" : undefined}
        >
          {ui.filterPanelCollapsed ? (
            <div className="flex flex-col items-center gap-5 w-full">
              <button
                onClick={() => ui.setFilterPanelCollapsed(false)}
                className="p-2 rounded-xl bg-surface-hi border border-line text-fg hover:text-cyan-txt hover:border-violet/40 transition-all cursor-pointer flex items-center justify-center"
                title="Expand Filters"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
              <div className="h-px bg-line/60 w-full" />
              <div className="relative flex flex-col items-center gap-1.5 py-4 w-full">
                <SlidersHorizontal className="h-5 w-5 text-muted" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest [writing-mode:vertical-lr] mt-2 select-none">
                  Filters
                </span>
                {activeCount > 0 && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-violet-txt px-1.5 py-0.5 text-[9px] font-bold text-white leading-none">
                    {activeCount}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-line/60">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-fg flex items-center gap-2">
                    <SlidersHorizontal className="h-4.5 w-4.5 text-violet-txt" />
                    Filters
                  </h3>
                  {activeCount > 0 && (
                    <button
                      onClick={() => store.reset()}
                      className="text-[10px] text-muted hover:text-rose-400 flex items-center gap-0.5 transition-colors border border-line rounded px-1.5 py-0.5 bg-bg/50 cursor-pointer"
                      title="Clear all filters"
                    >
                      <RotateCcw className="h-2.5 w-2.5" />
                      Clear
                    </button>
                  )}
                </div>
                <button
                  onClick={() => ui.setFilterPanelCollapsed(true)}
                  className="p-1 rounded-lg hover:bg-surface-hi text-muted hover:text-fg transition-colors cursor-pointer"
                  title="Collapse Filters"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
              <SidebarContent store={store} categories={categories} appAreas={appAreas} activeCount={activeCount} />
            </div>
          )}
        </motion.aside>

        {/* Right Column: Results Grid */}
        <main className="flex-grow space-y-6">
          {/* Controls Ribbon */}
          <div className="flex items-center justify-between gap-3 bg-surface/50 border border-line/75 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              {/* Mobile trigger */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => ui.setFilterDrawer(true)}
                className="lg:hidden flex items-center gap-2 h-9 px-3.5"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeCount > 0 && (
                  <span className="rounded-full bg-violet px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                    {activeCount}
                  </span>
                )}
              </Button>
              <div className="text-xs text-muted">
                {loadingProjects ? (
                  <span>Searching...</span>
                ) : (
                  <span>Showing <strong className="text-fg">{projectsData?.total || 0}</strong> projects</span>
                )}
              </div>
            </div>

            {/* Sort Dropdown & Density Toggle */}
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

              {/* Sort Select */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted hidden sm:inline">Sort:</span>
                <select
                  value={store.sort}
                  onChange={(e) => store.setSort(e.target.value as any)}
                  className="rounded-lg border border-line bg-bg px-2.5 py-1.5 text-xs text-fg focus:outline-none focus:border-violet/70 focus:ring-1 focus:ring-violet/30 cursor-pointer"
                >
                  <option value="importance">Highest Quality</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Additions</option>
                </select>
              </div>
            </div>
          </div>

          {/* Catalog grid */}
          {loadingProjects ? (
            <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${getGridColsClass()}`}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="flex flex-col h-[340px] rounded-2xl bg-surface border border-line p-5 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-7 w-5/6" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="mt-auto pt-4 flex justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : !projectsData || projectsData.items.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-line rounded-2xl bg-surface/30">
              <RotateCcw className="h-10 w-10 text-faint mx-auto mb-3" />
              <h3 className="font-display font-semibold text-lg text-fg">No Matches Found</h3>
              <p className="text-muted text-sm mt-1 mb-6">
                Try widening your search terms or relaxing your filter constraints.
              </p>
              <Button variant="outline" onClick={() => store.reset()}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${getGridColsClass()} transition-opacity duration-200 min-h-[400px] pb-4 ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}>
              {projectsData.items.map((project) => (
                <div key={project.id} className="h-full">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {projectsData && projectsData.pages > 1 && (
            <div className="border-t border-line/40 pt-8 mt-14 mb-10 space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1.5 h-10 px-4 rounded-xl border-line/80 bg-surface/80 hover:bg-surface-hi hover:border-violet/40 text-fg"
                >
                  <ChevronLeft className="h-4 w-4 text-cyan" />
                  <span className="hidden sm:inline font-medium">Previous</span>
                </Button>

                <div className="flex items-center gap-1.5 bg-surface/60 border border-line/60 p-1.5 rounded-2xl backdrop-blur-md shadow-inner">
                  {buildPageList(currentPage, projectsData.pages).map((p, i) =>
                    p === "ellipsis" ? (
                      <span key={`gap-${i}`} className="px-2 text-faint select-none font-bold">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => store.setPage(p)}
                        aria-current={p === currentPage ? "page" : undefined}
                        className={`h-9 min-w-[2.4rem] px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          p === currentPage
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 border border-violet-400/30 scale-[1.05]"
                            : "text-muted hover:text-fg hover:bg-surface-hi border border-transparent"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= projectsData.pages}
                  className="flex items-center gap-1.5 h-10 px-4 rounded-xl border-line/80 bg-surface/80 hover:bg-surface-hi hover:border-violet/40 text-fg"
                >
                  <span className="hidden sm:inline font-medium">Next</span>
                  <ChevronRight className="h-4 w-4 text-cyan" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-faint">
                <span>Showing page</span>
                <span className="inline-flex items-center justify-center rounded-md bg-violet/10 border border-violet/20 px-2 py-0.5 font-bold text-violet-txt">
                  {currentPage} of {projectsData.pages}
                </span>
                <span>({projectsData.total} total projects)</span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer Slide-out Backdrop */}
      <AnimatePresence>
        {ui.filterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              className="absolute inset-0 bg-bg/85 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => ui.setFilterDrawer(false)}
            />
            {/* Drawer panel */}
            <motion.div
              className="relative w-full max-w-sm bg-surface border-l border-line p-6 shadow-2xl flex flex-col h-full overflow-y-auto overscroll-y-contain"
              data-lenis-prevent
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => ui.setFilterDrawer(false)}
                className="absolute top-4 right-4 text-muted hover:text-fg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="pt-4">
                <SidebarContent store={store} categories={categories} appAreas={appAreas} activeCount={activeCount} />
              </div>
              <Button variant="primary" className="mt-8 w-full" onClick={() => ui.setFilterDrawer(false)}>
                Apply Filters
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
