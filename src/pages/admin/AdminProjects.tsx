import { useState } from "react";
import { Trash2, Pencil, Plus, AlertCircle, FolderKanban, Search, Star, Code, Layers, Sparkles, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import {
  useAdminProjects,
  useCreateAdminProject,
  useUpdateAdminProject,
  useDeleteAdminProject,
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
  suggestedTech: "",
  suggestedModules: "",
  categoryId: "",
  subCategoryId: null,
  applicationAreaId: null,
};

export default function AdminProjects() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAdminProjects(page, search || undefined);
  const { data: categories } = useAdminCategories();
  const { data: subCategories } = useAdminSubCategories();
  const { data: appAreas } = useAdminApplicationAreas();

  const createMutation = useCreateAdminProject();
  const updateMutation = useUpdateAdminProject();
  const deleteMutation = useDeleteAdminProject();

  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [form, setForm] = useState<ProjectInput>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

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
      importanceScore: Number(form.importanceScore) || 50,
    };

    if (editing === "new") {
      createMutation.mutate(body, {
        onSuccess: () => {
          setEditing(null);
          setFormError(null);
        },
        onError: (err: any) => {
          setFormError(err?.message || "Failed to create project. Please check required fields.");
        },
      });
    } else if (editing) {
      updateMutation.mutate(
        { id: editing.id, body },
        {
          onSuccess: () => {
            setEditing(null);
            setFormError(null);
          },
          onError: (err: any) => {
            setFormError(err?.message || "Failed to update project.");
          },
        }
      );
    }
  };

  const handleDelete = (project: Project) => {
    if (!confirm(`Delete project "${project.projectTitle}"? This only works if it has no existing orders or enquiries.`))
      return;
    deleteMutation.mutate(project.id);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const columns: Column<Project>[] = [
    {
      key: "title",
      header: "Project Title & Brief",
      render: (p) => (
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <span className="font-bold text-fg text-xs line-clamp-1 hover:text-cyan transition-colors" title={p.projectTitle}>
              {p.projectTitle}
            </span>
            {p.sellabilityTier === "Premium" && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-400">
                <Star className="h-2.5 w-2.5 fill-current" />
                PREMIUM
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
      key: "tier",
      header: "Tier / Level",
      render: (p) => (
        <div className="flex flex-col gap-1">
          {p.sellabilityTier ? (
            <span className="text-[10px] font-bold text-violet px-2 py-0.5 rounded-md bg-violet/10 border border-violet/20 w-fit">
              {p.sellabilityTier}
            </span>
          ) : (
            <span className="text-muted text-xs">—</span>
          )}
          {p.complexity && (
            <span className="text-[9px] font-mono text-muted">
              {p.complexity}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "price",
      header: "Effective Price",
      render: (p) => {
        const effective = p.discountedPrice ?? p.recommendedPrice ?? p.originalPrice ?? 0;
        return (
          <div>
            <span className="font-mono font-bold text-sm text-emerald-400 block">
              ₹{effective.toLocaleString("en-IN")}
            </span>
            {p.recommendedPrice && p.discountedPrice && p.discountedPrice < p.recommendedPrice && (
              <span className="text-[10px] text-muted line-through font-mono">
                ₹{p.recommendedPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        );
      },
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
            title="View Live Page"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
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
            Manage repository titles, descriptions, pricing tiers, technology stacks, and system modules.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              placeholder="Search title/brief..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 bg-surface-hi/60 text-xs"
            />
          </div>
          <Button variant="primary" onClick={openNew} className="gap-1.5 shadow-md shadow-violet-500/20">
            <Plus className="h-4 w-4" />
            Add New Project
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(p) => p.id}
        isLoading={isLoading}
        page={data?.page}
        pages={data?.pages}
        onPageChange={setPage}
        emptyMessage="No engineering projects match the search filter."
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
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {formError}
            </div>
          )}

          <Field label="Project Title" htmlFor="p-title" required>
            <Input
              id="p-title"
              value={form.projectTitle}
              onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
              placeholder="e.g. Privacy-Preserving Health Platform using Federated ML"
              required
            />
          </Field>

          <Field label="Short Brief (Lead Intro)" htmlFor="p-brief">
            <Textarea
              id="p-brief"
              rows={2}
              value={form.brief}
              onChange={(e) => setForm({ ...form, brief: e.target.value })}
              placeholder="1-2 sentences summarizing the project for catalog cards."
            />
          </Field>

          <Field label="Detailed Technical Description" htmlFor="p-detailed">
            <Textarea
              id="p-detailed"
              rows={4}
              value={form.detailed}
              onChange={(e) => setForm({ ...form, detailed: e.target.value })}
              placeholder="Full system overview, architecture description, and algorithms utilized."
            />
          </Field>

          {/* Categories & Domains */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Academic Category" htmlFor="p-cat" required>
              <select
                id="p-cat"
                className="w-full rounded-xl border border-line bg-surface-hi px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value, subCategoryId: null })}
                required
              >
                <option value="">Select Stream...</option>
                {categories?.items.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Sub-Category" htmlFor="p-subcat">
              <select
                id="p-subcat"
                className="w-full rounded-xl border border-line bg-surface-hi px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
                value={form.subCategoryId ?? ""}
                onChange={(e) => setForm({ ...form, subCategoryId: e.target.value || null })}
              >
                <option value="">None</option>
                {filteredSubCategories.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.subCategoryName}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Application Domain" htmlFor="p-apparea">
              <select
                id="p-apparea"
                className="w-full rounded-xl border border-line bg-surface-hi px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
                value={form.applicationAreaId ?? ""}
                onChange={(e) => setForm({ ...form, applicationAreaId: e.target.value || null })}
              >
                <option value="">None</option>
                {appAreas?.items.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.applicationAreaName}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Pricing Grid */}
          <div className="rounded-2xl border border-line bg-surface-hi/40 p-4 space-y-3">
            <span className="text-xs font-bold text-fg block">Pricing Parameters (₹ INR)</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Discounted / Effective Price (₹)" htmlFor="p-disc">
                <Input
                  id="p-disc"
                  type="number"
                  value={form.discountedPrice ?? ""}
                  onChange={(e) => setForm({ ...form, discountedPrice: e.target.value ? Number(e.target.value) : null })}
                  placeholder="e.g. 6500"
                />
              </Field>
              <Field label="Recommended List Price (₹)" htmlFor="p-rec">
                <Input
                  id="p-rec"
                  type="number"
                  value={form.recommendedPrice ?? ""}
                  onChange={(e) => setForm({ ...form, recommendedPrice: e.target.value ? Number(e.target.value) : null })}
                  placeholder="e.g. 7000"
                />
              </Field>
              <Field label="Original Base Price (₹)" htmlFor="p-orig">
                <Input
                  id="p-orig"
                  type="number"
                  value={form.originalPrice ?? ""}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value ? Number(e.target.value) : null })}
                  placeholder="e.g. 8000"
                />
              </Field>
            </div>
          </div>

          {/* Tiers & Score */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Sellability Tier" htmlFor="p-tier">
              <select
                id="p-tier"
                className="w-full rounded-xl border border-line bg-surface-hi px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
                value={form.sellabilityTier}
                onChange={(e) => setForm({ ...form, sellabilityTier: e.target.value })}
              >
                {SELLABILITY_TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t || "None"}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Complexity Level" htmlFor="p-comp">
              <select
                id="p-comp"
                className="w-full rounded-xl border border-line bg-surface-hi px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
                value={form.complexity}
                onChange={(e) => setForm({ ...form, complexity: e.target.value })}
              >
                {COMPLEXITY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c || "None"}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Quality Score (0-100)" htmlFor="p-score">
              <Input
                id="p-score"
                type="number"
                min={0}
                max={100}
                value={form.importanceScore}
                onChange={(e) => setForm({ ...form, importanceScore: Number(e.target.value) })}
              />
            </Field>
          </div>

          {/* Tech Stack & Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Suggested Tech Stack (Comma separated)" htmlFor="p-tech">
              <Input
                id="p-tech"
                value={form.suggestedTech}
                onChange={(e) => setForm({ ...form, suggestedTech: e.target.value })}
                placeholder="React, NodeJS, PyTorch, MongoDB"
              />
            </Field>
            <Field label="Suggested Modules (Comma separated)" htmlFor="p-mod">
              <Input
                id="p-mod"
                value={form.suggestedModules}
                onChange={(e) => setForm({ ...form, suggestedModules: e.target.value })}
                placeholder="Auth, Model Training, Payment Gateway"
              />
            </Field>
          </div>

          <div className="pt-2">
            <Button
              className="w-full h-11 text-sm shadow-lg shadow-violet-500/25"
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving project package..." : editing === "new" ? "Create Project Deliverable" : "Save Project Package"}
            </Button>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
