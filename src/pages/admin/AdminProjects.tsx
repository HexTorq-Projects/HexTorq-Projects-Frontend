import { useState } from "react";
import { Trash2, Pencil, Plus, AlertCircle } from "lucide-react";
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
      setFormError("Please select a Category.");
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
          setFormError(err?.message || "Failed to create project. Please verify required fields.");
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
    if (!confirm(`Delete project "${project.projectTitle}"? This only works if it has no orders/wishlist/enquiries/offers.`))
      return;
    deleteMutation.mutate(project.id);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const columns: Column<Project>[] = [
    { key: "title", header: "Title", render: (p) => p.projectTitle },
    { key: "category", header: "Category", render: (p) => p.category?.categoryName ?? "—" },
    { key: "tier", header: "Tier", render: (p) => p.sellabilityTier ?? "—" },
    {
      key: "price",
      header: "Price",
      render: (p) => (
        <span>
          ₹{p.discountedPrice ?? p.recommendedPrice ?? p.originalPrice ?? 0}
          {p.recommendedPrice && p.discountedPrice && p.discountedPrice < p.recommendedPrice && (
            <span className="ml-1 text-xs text-faint line-through">₹{p.recommendedPrice}</span>
          )}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <div className="flex gap-2 justify-end">
          <button onClick={() => openEdit(p)} className="text-muted hover:text-violet">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(p)} className="text-muted hover:text-rose-400">
            <Trash2 className="h-4 w-4" />
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
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="font-display text-2xl font-bold text-fg">Projects</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search title/brief..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
          <Button variant="auth" onClick={openNew}>
            <Plus className="h-4 w-4" /> New
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
      />

      <FormModal open={!!editing} title={editing === "new" ? "New Project" : "Edit Project"} onClose={() => setEditing(null)} wide>
        <div className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Field label="Title *" htmlFor="p-title">
            <Input
              id="p-title"
              placeholder="e.g. Smart IoT Weather Monitoring System"
              value={form.projectTitle}
              onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
            />
          </Field>

          <Field label="Brief Description" htmlFor="p-brief">
            <Textarea
              id="p-brief"
              placeholder="Short overview of the project..."
              value={form.brief}
              onChange={(e) => setForm({ ...form, brief: e.target.value })}
            />
          </Field>

          <Field label="Detailed Description" htmlFor="p-detailed">
            <Textarea
              id="p-detailed"
              placeholder="In-depth details, working principle, architecture..."
              className="min-h-32"
              value={form.detailed}
              onChange={(e) => setForm({ ...form, detailed: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category *" htmlFor="p-category">
              <select
                id="p-category"
                className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value, subCategoryId: null })}
              >
                <option value="">Select Category</option>
                {categories?.items.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Sub-category" htmlFor="p-subcategory">
              <select
                id="p-subcategory"
                className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
                value={form.subCategoryId ?? ""}
                onChange={(e) => setForm({ ...form, subCategoryId: e.target.value || null })}
              >
                <option value="">Select Sub-category (Optional)</option>
                {filteredSubCategories.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.subCategoryName}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Application Area" htmlFor="p-apparea">
            <select
              id="p-apparea"
              className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
              value={form.applicationAreaId ?? ""}
              onChange={(e) => setForm({ ...form, applicationAreaId: e.target.value || null })}
            >
              <option value="">Select Application Area (Optional)</option>
              {appAreas?.items.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.applicationAreaName}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Importance Score (0 - 100)" htmlFor="p-importance">
              <Input
                id="p-importance"
                type="number"
                min={0}
                max={100}
                value={form.importanceScore}
                onChange={(e) => setForm({ ...form, importanceScore: Number(e.target.value) })}
              />
            </Field>

            <Field label="Score Band" htmlFor="p-scoreband">
              <select
                id="p-scoreband"
                className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
                value={form.scoreBand}
                onChange={(e) => setForm({ ...form, scoreBand: e.target.value })}
              >
                {SCORE_BANDS.map((sb) => (
                  <option key={sb} value={sb}>
                    {sb}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Sellability Tier" htmlFor="p-tier">
              <select
                id="p-tier"
                className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
                value={form.sellabilityTier ?? ""}
                onChange={(e) => setForm({ ...form, sellabilityTier: e.target.value })}
              >
                {SELLABILITY_TIERS.map((st) => (
                  <option key={st} value={st}>
                    {st === "" ? "Standard (Default)" : st}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Complexity" htmlFor="p-complexity">
              <select
                id="p-complexity"
                className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
                value={form.complexity ?? ""}
                onChange={(e) => setForm({ ...form, complexity: e.target.value })}
              >
                {COMPLEXITY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c === "" ? "Not Specified" : c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Original Price (₹)" htmlFor="p-original">
              <Input
                id="p-original"
                type="number"
                placeholder="e.g. 5000"
                value={form.originalPrice ?? ""}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>

            <Field label="Recommended Price (₹)" htmlFor="p-recommended">
              <Input
                id="p-recommended"
                type="number"
                placeholder="e.g. 4500"
                value={form.recommendedPrice ?? ""}
                onChange={(e) => setForm({ ...form, recommendedPrice: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>

            <Field label="Discounted Price (₹)" htmlFor="p-discounted">
              <Input
                id="p-discounted"
                type="number"
                placeholder="e.g. 3999"
                value={form.discountedPrice ?? ""}
                onChange={(e) => setForm({ ...form, discountedPrice: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
          </div>

          <Field label="Suggested Tech" htmlFor="p-tech" hint="Comma-separated">
            <Textarea
              id="p-tech"
              placeholder="e.g. ESP32, Arduino C++, React, Node.js"
              value={form.suggestedTech ?? ""}
              onChange={(e) => setForm({ ...form, suggestedTech: e.target.value })}
            />
          </Field>

          <Field label="Suggested Modules" htmlFor="p-modules" hint="Comma-separated">
            <Textarea
              id="p-modules"
              placeholder="e.g. DHT11 Sensor, OLED Display, Wi-Fi Module"
              value={form.suggestedModules ?? ""}
              onChange={(e) => setForm({ ...form, suggestedModules: e.target.value })}
            />
          </Field>

          <Button className="w-full mt-2" variant="auth" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving Project..." : "Save Project"}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}

