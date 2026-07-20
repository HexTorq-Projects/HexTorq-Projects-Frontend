import { useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
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

const EMPTY_FORM: ProjectInput = {
  projectTitle: "",
  brief: "",
  detailed: "",
  importanceScore: 50,
  scoreBand: "",
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

  const openNew = () => {
    setEditing("new");
    setForm(EMPTY_FORM);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      projectTitle: project.projectTitle,
      brief: project.brief,
      detailed: project.detailed,
      importanceScore: project.importanceScore,
      scoreBand: project.scoreBand,
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
    const body: ProjectInput = {
      ...form,
      sellabilityTier: form.sellabilityTier || null,
      complexity: form.complexity || null,
      suggestedTech: form.suggestedTech || null,
      suggestedModules: form.suggestedModules || null,
      subCategoryId: form.subCategoryId || null,
      applicationAreaId: form.applicationAreaId || null,
    };
    if (editing === "new") {
      createMutation.mutate(body, { onSuccess: () => setEditing(null) });
    } else if (editing) {
      updateMutation.mutate({ id: editing.id, body }, { onSuccess: () => setEditing(null) });
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
          <Field label="Title" htmlFor="p-title">
            <Input id="p-title" value={form.projectTitle} onChange={(e) => setForm({ ...form, projectTitle: e.target.value })} />
          </Field>
          <Field label="Brief" htmlFor="p-brief">
            <Textarea id="p-brief" value={form.brief} onChange={(e) => setForm({ ...form, brief: e.target.value })} />
          </Field>
          <Field label="Detailed" htmlFor="p-detailed">
            <Textarea
              id="p-detailed"
              className="min-h-40"
              value={form.detailed}
              onChange={(e) => setForm({ ...form, detailed: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" htmlFor="p-category">
              <select
                id="p-category"
                className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value, subCategoryId: null })}
              >
                <option value="">Select category</option>
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
                <option value="">None</option>
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
              <option value="">None</option>
              {appAreas?.items.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.applicationAreaName}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Importance Score" htmlFor="p-importance">
              <Input
                id="p-importance"
                type="number"
                value={form.importanceScore}
                onChange={(e) => setForm({ ...form, importanceScore: Number(e.target.value) })}
              />
            </Field>
            <Field label="Score Band" htmlFor="p-scoreband">
              <Input id="p-scoreband" value={form.scoreBand} onChange={(e) => setForm({ ...form, scoreBand: e.target.value })} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Sellability Tier" htmlFor="p-tier">
              <Input
                id="p-tier"
                value={form.sellabilityTier ?? ""}
                onChange={(e) => setForm({ ...form, sellabilityTier: e.target.value })}
              />
            </Field>
            <Field label="Complexity" htmlFor="p-complexity">
              <Input
                id="p-complexity"
                value={form.complexity ?? ""}
                onChange={(e) => setForm({ ...form, complexity: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Original Price" htmlFor="p-original">
              <Input
                id="p-original"
                type="number"
                value={form.originalPrice ?? ""}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
            <Field label="Recommended Price" htmlFor="p-recommended">
              <Input
                id="p-recommended"
                type="number"
                value={form.recommendedPrice ?? ""}
                onChange={(e) => setForm({ ...form, recommendedPrice: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
            <Field label="Discounted Price" htmlFor="p-discounted">
              <Input
                id="p-discounted"
                type="number"
                value={form.discountedPrice ?? ""}
                onChange={(e) => setForm({ ...form, discountedPrice: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
          </div>

          <Field label="Suggested Tech" htmlFor="p-tech" hint="Comma-separated">
            <Textarea id="p-tech" value={form.suggestedTech ?? ""} onChange={(e) => setForm({ ...form, suggestedTech: e.target.value })} />
          </Field>
          <Field label="Suggested Modules" htmlFor="p-modules" hint="Comma-separated">
            <Textarea
              id="p-modules"
              value={form.suggestedModules ?? ""}
              onChange={(e) => setForm({ ...form, suggestedModules: e.target.value })}
            />
          </Field>

          <Button className="w-full" variant="auth" onClick={handleSave} disabled={isSaving || !form.categoryId}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}
