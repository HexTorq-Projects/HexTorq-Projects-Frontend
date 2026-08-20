import { useState } from "react";
import {
  Trash2,
  Pencil,
  Plus,
  AlertCircle,
  FolderKanban,
  Search,
  Star,
  Code,
  Layers,
  Sparkles,
  ExternalLink,
  Copy,
  Upload,
  Download,
  Video,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useAdminProjects,
  useCreateAdminProject,
  useUpdateAdminProject,
  useDeleteAdminProject,
  useDuplicateProject,
  useBulkImportProjects,
  useAdminCategories,
  useAdminSubCategories,
  useAdminApplicationAreas,
} from "@/api/admin";
import type { Project, ProjectInput } from "@/api/types";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal } from "@/components/admin/FormModal";
import { Button } from "@/components/ui/Button";
import { Input, Field, Textarea } from "@/components/ui/Input";

const SCORE_BANDS = ["Medium", "High", "Low", "Top Tier"];
const SELLABILITY_TIERS = ["", "Premium", "High", "Standard", "Popular", "Trending"];
const COMPLEXITY_OPTIONS = ["", "Beginner", "Intermediate", "Advanced", "Expert"];

const EMPTY_FORM: ProjectInput = {
  projectTitle: "",
  brief: "",
  detailed: "",
  importanceScore: 50,
  scoreBand: "Medium",
  sellabilityTier: "",
  complexity: "",
  recommendedPrice: null,
  discountedPrice: null,
  originalPrice: null,
  basicPrice: null,
  standardPrice: null,
  premiumPrice: null,
  elitePrice: null,
  isFeatured: false,
  isTrending: false,
  demoVideoUrl: null,
  outputImages: null,
  vivaQuestions: null,
  suggestedTech: "",
  suggestedModules: "",
  categoryId: "",
  subCategoryId: null,
  applicationAreaId: null,
};

export default function AdminProjects() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("");
  const { data, isLoading } = useAdminProjects(page, search || undefined, tier || undefined);
  const { data: categories } = useAdminCategories();
  const { data: subCategories } = useAdminSubCategories();
  const { data: appAreas } = useAdminApplicationAreas();

  const createMutation = useCreateAdminProject();
  const updateMutation = useUpdateAdminProject();
  const duplicateMutation = useDuplicateProject();
  const deleteMutation = useDeleteAdminProject();
  const bulkImportMutation = useBulkImportProjects();

  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [form, setForm] = useState<ProjectInput>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  // Bulk Import modal state
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState("");
  const [bulkResult, setBulkResult] = useState<{ importedCount: number; errors: string[] } | null>(null);

  const openNew = () => {
    setEditing("new");
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setFormError(null);
    setForm({
      projectTitle: project.projectTitle,
      brief: project.brief,
      detailed: project.detailed,
      importanceScore: project.importanceScore,
      scoreBand: project.scoreBand || "Medium",
      sellabilityTier: project.sellabilityTier ?? "",
      complexity: project.complexity ?? "",
      recommendedPrice: project.recommendedPrice,
      discountedPrice: project.discountedPrice,
      originalPrice: project.originalPrice,
      basicPrice: project.basicPrice ?? null,
      standardPrice: project.standardPrice ?? null,
      premiumPrice: project.premiumPrice ?? null,
      elitePrice: project.elitePrice ?? null,
      isFeatured: project.isFeatured ?? false,
      isTrending: project.isTrending ?? false,
      demoVideoUrl: project.demoVideoUrl ?? null,
      outputImages: project.outputImages ?? null,
      vivaQuestions: project.vivaQuestions ?? null,
      suggestedTech: project.suggestedTech ?? "",
      suggestedModules: project.suggestedModules ?? "",
      categoryId: project.category?.id ?? "",
      subCategoryId: project.subCategory?.id ?? null,
      applicationAreaId: project.applicationArea?.id ?? null,
    });
  };

  const handleSave = () => {
    setFormError(null);

    if (!form.projectTitle.trim()) {
      setFormError("Project Title is required.");
      return;
    }
    if (!form.categoryId) {
      setFormError("Please select an academic Category.");
      return;
    }

    const title = form.projectTitle.trim();
    const brief = form.brief.trim() || title;
    const detailed = form.detailed.trim() || brief;
    const scoreBand = form.scoreBand.trim() || "Medium";

    const body: ProjectInput = {
      ...form,
      projectTitle: title,
      brief,
      detailed,
      scoreBand,
      sellabilityTier: form.sellabilityTier || null,
      complexity: form.complexity || null,
      suggestedTech: form.suggestedTech || null,
      suggestedModules: form.suggestedModules || null,
      subCategoryId: form.subCategoryId || null,
      applicationAreaId: form.applicationAreaId || null,
      recommendedPrice: form.recommendedPrice ? Number(form.recommendedPrice) : null,
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : null,
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      basicPrice: form.basicPrice ? Number(form.basicPrice) : null,
      standardPrice: form.standardPrice ? Number(form.standardPrice) : null,
      premiumPrice: form.premiumPrice ? Number(form.premiumPrice) : null,
      elitePrice: form.elitePrice ? Number(form.elitePrice) : null,
      importanceScore: Number(form.importanceScore) || 50,
    };

    if (editing === "new") {
      createMutation.mutate(body, {
        onSuccess: () => {
          setEditing(null);
          setFormError(null);
        },
        onError: (err: any) => setFormError(err?.message || "Failed to create project."),
      });
    } else if (editing) {
      updateMutation.mutate(
        { id: editing.id, body },
        {
          onSuccess: () => {
            setEditing(null);
            setFormError(null);
          },
          onError: (err: any) => setFormError(err?.message || "Failed to update project."),
        }
      );
    }
  };

  const handleDuplicate = (project: Project) => {
    duplicateMutation.mutate(project.id);
  };

  const handleDelete = (project: Project) => {
    if (!confirm(`Delete project "${project.projectTitle}"? This only works if it has no existing orders or enquiries.`))
      return;
    deleteMutation.mutate(project.id);
  };

  const handleProcessBulkImport = () => {
    const lines = bulkCsvText.trim().split("\n");
    if (lines.length < 2) return;

    const defaultCatId = categories?.items[0]?.id || "";
    const items = lines.slice(1).map((line) => {
      const parts = line.split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
      return {
        projectTitle: parts[0] || "Untitled Project",
        brief: parts[1] || "",
        discountedPrice: Number(parts[2]) || 5500,
        suggestedTech: parts[3] || "React, Node.js, AI/ML",
        categoryId: defaultCatId,
      };
    });

    bulkImportMutation.mutate(items, {
      onSuccess: (res) => {
        setBulkResult({ importedCount: res.importedCount, errors: res.errors });
        if (res.errors.length === 0) {
          setTimeout(() => {
            setBulkModalOpen(false);
            setBulkResult(null);
            setBulkCsvText("");
          }, 1500);
        }
      },
    });
  };

  const columns: Column<Project>[] = [
    {
      key: "title",
      header: "Project Deliverable & Brief",
      render: (p) => (
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <span className="font-bold text-fg text-xs line-clamp-1 hover:text-cyan transition-colors" title={p.projectTitle}>
              {p.projectTitle}
            </span>
            {p.isFeatured && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-400">
                <Star className="h-2.5 w-2.5 fill-current" />
                FEATURED
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{p.brief}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Academic Stream",
      render: (p) => (
        <span className="text-xs font-semibold text-fg bg-surface-hi border border-line px-2.5 py-1 rounded-lg">
          {p.category?.categoryName ?? "—"}
        </span>
      ),
    },
    {
      key: "tierPricing",
      header: "Tier Pricing (INR)",
      render: (p) => (
        <div className="flex flex-col gap-0.5 text-[11px] font-mono">
          <span className="text-emerald-400 font-bold">
            ₹{(p.discountedPrice ?? p.recommendedPrice ?? 5500).toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-muted">
            Basic: ₹{p.basicPrice || 3500} • Elite: ₹{p.elitePrice || 12000}
          </span>
        </div>
      ),
    },
    {
      key: "ordersCount",
      header: "Orders Placed",
      render: (p) => (
        <span className="text-xs font-bold text-fg px-2 py-0.5 rounded-md bg-surface-hi border border-line">
          {p._count?.orderItems || 0} orders
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <div className="flex gap-1.5 justify-end">
          <Link
            to={`/project/${p.id}`}
            target="_blank"
            className="p-1.5 rounded-lg text-muted hover:text-cyan hover:bg-cyan/10 border border-transparent hover:border-cyan/20 transition-all"
            title="View live catalog"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => handleDuplicate(p)}
            className="p-1.5 rounded-lg text-muted hover:text-cyan hover:bg-cyan/10 border border-transparent hover:border-cyan/20 transition-all cursor-pointer"
            title="Duplicate package"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => openEdit(p)}
            className="p-1.5 rounded-lg text-muted hover:text-violet hover:bg-violet/10 border border-transparent hover:border-violet/20 transition-all cursor-pointer"
            title="Edit project"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDelete(p)}
            className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Delete project"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  const filteredSubCategories = (subCategories?.items ?? []).filter(
    (sc) => !form.categoryId || sc.categoryId === form.categoryId
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-fg flex items-center gap-2.5">
            <FolderKanban className="h-6 w-6 text-cyan" />
            Engineering Projects Catalog
          </h1>
          <p className="text-xs text-muted">
            Manage repository titles, 4-tier pricing matrix, demo media, and Viva Q&A question banks.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setBulkModalOpen(true)} className="gap-1.5 border-line hover:border-violet/40">
            <Upload className="h-4 w-4" /> Bulk CSV Import
          </Button>
          <Button variant="primary" onClick={openNew} className="gap-1.5 shadow-md shadow-violet-500/20">
            <Plus className="h-4 w-4" /> Add Deliverable
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search title, tech, or brief..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-surface-hi/60 text-xs"
          />
        </div>

        <select
          className="rounded-xl border border-line bg-surface-hi/60 px-3 py-2 text-xs text-fg cursor-pointer"
          value={tier}
          onChange={(e) => {
            setTier(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Tiers</option>
          {SELLABILITY_TIERS.filter(Boolean).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(p) => p.id}
        isLoading={isLoading}
        page={data?.page}
        pages={data?.pages}
        onPageChange={setPage}
        emptyMessage="No projects match the criteria."
      />

      {/* Project Create/Edit Modal */}
      <FormModal
        open={!!editing}
        title={editing === "new" ? "Add New Project Deliverable" : "Edit Project Package"}
        onClose={() => setEditing(null)}
        wide
      >
        <div className="space-y-5 text-xs">
          {formError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {formError}
            </div>
          )}

          <Field label="Project Title" htmlFor="p-title" required>
            <Input
              id="p-title"
              value={form.projectTitle}
              onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
              placeholder="e.g. Real-Time Autonomous Drone Detection using Deep CNNs"
              required
            />
          </Field>

          <Field label="Short Brief (Lead Intro)" htmlFor="p-brief">
            <Textarea
              id="p-brief"
              rows={2}
              value={form.brief}
              onChange={(e) => setForm({ ...form, brief: e.target.value })}
            />
          </Field>

          <Field label="Detailed Technical Description" htmlFor="p-detailed">
            <Textarea
              id="p-detailed"
              rows={3}
              value={form.detailed}
              onChange={(e) => setForm({ ...form, detailed: e.target.value })}
            />
          </Field>

          {/* Academic Categorization */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Academic Stream" htmlFor="p-cat" required>
              <select
                id="p-cat"
                className="w-full rounded-xl border border-line bg-surface-hi px-3 py-2 text-xs text-fg"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value, subCategoryId: null })}
                required
              >
                <option value="">Select Stream...</option>
                {categories?.items.map((c) => (
                  <option key={c.id} value={c.id}>{c.categoryName}</option>
                ))}
              </select>
            </Field>

            <Field label="Sub-Category Branch" htmlFor="p-subcat">
              <select
                id="p-subcat"
                className="w-full rounded-xl border border-line bg-surface-hi px-3 py-2 text-xs text-fg"
                value={form.subCategoryId ?? ""}
                onChange={(e) => setForm({ ...form, subCategoryId: e.target.value || null })}
              >
                <option value="">None</option>
                {filteredSubCategories.map((sc) => (
                  <option key={sc.id} value={sc.id}>{sc.subCategoryName}</option>
                ))}
              </select>
            </Field>

            <Field label="Application Domain" htmlFor="p-apparea">
              <select
                id="p-apparea"
                className="w-full rounded-xl border border-line bg-surface-hi px-3 py-2 text-xs text-fg"
                value={form.applicationAreaId ?? ""}
                onChange={(e) => setForm({ ...form, applicationAreaId: e.target.value || null })}
              >
                <option value="">None</option>
                {appAreas?.items.map((a) => (
                  <option key={a.id} value={a.id}>{a.applicationAreaName}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* 4-Tier Pricing Grid */}
          <div className="rounded-2xl border border-line bg-surface-hi/40 p-4 space-y-3">
            <span className="text-xs font-bold text-fg block">4-Tier Service Package Pricing (₹ INR)</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Basic (₹)" htmlFor="p-bp">
                <Input
                  id="p-bp"
                  type="number"
                  value={form.basicPrice ?? ""}
                  onChange={(e) => setForm({ ...form, basicPrice: e.target.value ? Number(e.target.value) : null })}
                  placeholder="3500"
                />
              </Field>
              <Field label="Standard (₹)" htmlFor="p-sp">
                <Input
                  id="p-sp"
                  type="number"
                  value={form.standardPrice ?? ""}
                  onChange={(e) => setForm({ ...form, standardPrice: e.target.value ? Number(e.target.value) : null })}
                  placeholder="5500"
                />
              </Field>
              <Field label="Premium (₹)" htmlFor="p-pp">
                <Input
                  id="p-pp"
                  type="number"
                  value={form.premiumPrice ?? ""}
                  onChange={(e) => setForm({ ...form, premiumPrice: e.target.value ? Number(e.target.value) : null })}
                  placeholder="7500"
                />
              </Field>
              <Field label="Elite (₹)" htmlFor="p-ep">
                <Input
                  id="p-ep"
                  type="number"
                  value={form.elitePrice ?? ""}
                  onChange={(e) => setForm({ ...form, elitePrice: e.target.value ? Number(e.target.value) : null })}
                  placeholder="12000"
                />
              </Field>
            </div>
          </div>

          {/* Media & Viva Q&A */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Demo Video URL (YouTube / Loom)" htmlFor="p-video">
              <Input
                id="p-video"
                value={form.demoVideoUrl ?? ""}
                onChange={(e) => setForm({ ...form, demoVideoUrl: e.target.value || null })}
                placeholder="https://youtube.com/..."
              />
            </Field>

            <Field label="Viva Q&A Notes (JSON or Text)" htmlFor="p-viva">
              <Input
                id="p-viva"
                value={form.vivaQuestions ?? ""}
                onChange={(e) => setForm({ ...form, vivaQuestions: e.target.value || null })}
                placeholder="Top viva questions and answers..."
              />
            </Field>
          </div>

          <Button
            className="w-full h-11 text-sm shadow-lg shadow-violet-500/25"
            variant="primary"
            onClick={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            Save Project Package
          </Button>
        </div>
      </FormModal>

      {/* Bulk CSV Import Modal */}
      <FormModal open={bulkModalOpen} title="Bulk CSV Catalog Import" onClose={() => setBulkModalOpen(false)}>
        <div className="space-y-4 text-xs">
          <p className="text-muted leading-relaxed">
            Paste CSV formatted catalog records below (Format: <code>Title, Brief, Price, TechStack</code>):
          </p>
          <Textarea
            rows={8}
            className="font-mono text-xs"
            value={bulkCsvText}
            onChange={(e) => setBulkCsvText(e.target.value)}
            placeholder={`Title,Brief,Price,Tech\nSmart Traffic AI,Traffic flow prediction,5500,"Python, PyTorch"\nFederated EHR,Privacy health ledger,6500,"React, Solidity"`}
          />

          {bulkResult && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-400">
              Successfully imported {bulkResult.importedCount} projects!
            </div>
          )}

          <Button
            className="w-full shadow-md shadow-violet-500/20"
            variant="primary"
            onClick={handleProcessBulkImport}
            disabled={bulkImportMutation.isPending || !bulkCsvText.trim()}
          >
            {bulkImportMutation.isPending ? "Importing records..." : "Process CSV Import"}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}
