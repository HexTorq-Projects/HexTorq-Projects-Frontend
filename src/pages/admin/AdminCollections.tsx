import { useState } from "react";
import { Trash2, Pencil, Plus, Tags, Layers, Globe, Sparkles, FolderTree } from "lucide-react";
import {
  useAdminCategories,
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
  useAdminSubCategories,
  useCreateAdminSubCategory,
  useUpdateAdminSubCategory,
  useDeleteAdminSubCategory,
  useAdminApplicationAreas,
  useCreateAdminApplicationArea,
  useUpdateAdminApplicationArea,
  useDeleteAdminApplicationArea,
} from "@/api/admin";
import type { Category, SubCategoryAdmin, ApplicationAreaAdmin } from "@/api/types";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal } from "@/components/admin/FormModal";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

type Tab = "categories" | "subcategories" | "appareas";

function CategoriesTab() {
  const { data, isLoading } = useAdminCategories();
  const createMutation = useCreateAdminCategory();
  const updateMutation = useUpdateAdminCategory();
  const deleteMutation = useDeleteAdminCategory();
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [name, setName] = useState("");

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Category / Academic Stream",
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet/10 border border-violet/20 text-violet text-xs font-bold shrink-0">
            <Tags className="h-4 w-4" />
          </div>
          <span className="font-bold text-fg text-xs">{c.categoryName}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (c) => (
        <div className="flex gap-1.5 justify-end">
          <button
            onClick={() => {
              setEditing(c);
              setName(c.categoryName);
            }}
            className="p-1.5 rounded-lg text-muted hover:text-violet hover:bg-violet/10 border border-transparent hover:border-violet/20 transition-all cursor-pointer"
            title="Edit category"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => confirm(`Delete category "${c.categoryName}"?`) && deleteMutation.mutate(c.id)}
            className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Delete category"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  const handleSave = () => {
    if (editing === "new") {
      createMutation.mutate({ categoryName: name }, { onSuccess: () => setEditing(null) });
    } else if (editing) {
      updateMutation.mutate({ id: editing.id, body: { categoryName: name } }, { onSuccess: () => setEditing(null) });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted">
          Major engineering departments (e.g. AI/ML, Cybersecurity, Web Apps, IoT).
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditing("new");
            setName("");
          }}
          className="gap-1.5 shadow-md shadow-violet-500/20"
        >
          <Plus className="h-4 w-4" /> Add Stream
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(c) => c.id}
        isLoading={isLoading}
        emptyMessage="No categories created yet."
      />

      <FormModal open={!!editing} title={editing === "new" ? "New Academic Stream" : "Edit Academic Stream"} onClose={() => setEditing(null)}>
        <div className="space-y-4 text-xs">
          <Field label="Category Name" htmlFor="cat-name" required>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Artificial Intelligence & Data Science"
              required
            />
          </Field>
          <Button className="w-full shadow-md shadow-violet-500/20" variant="primary" onClick={handleSave} disabled={!name.trim()}>
            {editing === "new" ? "Create Stream" : "Save Stream"}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}

function SubCategoriesTab() {
  const { data, isLoading } = useAdminSubCategories();
  const { data: categories } = useAdminCategories();
  const createMutation = useCreateAdminSubCategory();
  const updateMutation = useUpdateAdminSubCategory();
  const deleteMutation = useDeleteAdminSubCategory();
  const [editing, setEditing] = useState<SubCategoryAdmin | "new" | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const columns: Column<SubCategoryAdmin>[] = [
    {
      key: "name",
      header: "Sub-Category Branch",
      render: (sc) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/20 text-cyan text-xs font-bold shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <span className="font-bold text-fg text-xs">{sc.subCategoryName}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Parent Academic Stream",
      render: (sc) => (
        <span className="text-xs font-semibold text-fg bg-surface-hi border border-line px-2.5 py-1 rounded-lg">
          {sc.category.categoryName}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (sc) => (
        <div className="flex gap-1.5 justify-end">
          <button
            onClick={() => {
              setEditing(sc);
              setName(sc.subCategoryName);
              setCategoryId(sc.categoryId);
            }}
            className="p-1.5 rounded-lg text-muted hover:text-violet hover:bg-violet/10 border border-transparent hover:border-violet/20 transition-all cursor-pointer"
            title="Edit sub-category"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => confirm(`Delete sub-category "${sc.subCategoryName}"?`) && deleteMutation.mutate(sc.id)}
            className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Delete sub-category"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  const handleSave = () => {
    if (editing === "new") {
      createMutation.mutate({ subCategoryName: name, categoryId }, { onSuccess: () => setEditing(null) });
    } else if (editing) {
      updateMutation.mutate(
        { id: editing.id, body: { subCategoryName: name, categoryId } },
        { onSuccess: () => setEditing(null) }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted">
          Sub-branches mapped under main academic departments (e.g. Deep Learning, Smart Contracts).
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditing("new");
            setName("");
            setCategoryId(categories?.items[0]?.id ?? "");
          }}
          className="gap-1.5 shadow-md shadow-violet-500/20"
        >
          <Plus className="h-4 w-4" /> Add Branch
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(sc) => sc.id}
        isLoading={isLoading}
        emptyMessage="No sub-categories created yet."
      />

      <FormModal open={!!editing} title={editing === "new" ? "New Sub-Branch" : "Edit Sub-Branch"} onClose={() => setEditing(null)}>
        <div className="space-y-4 text-xs">
          <Field label="Parent Stream" htmlFor="sc-cat" required>
            <select
              id="sc-cat"
              className="w-full rounded-xl border border-line bg-surface-hi px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories?.items.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sub-Category Branch Name" htmlFor="sc-name" required>
            <Input
              id="sc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Computer Vision & GANs"
              required
            />
          </Field>
          <Button className="w-full shadow-md shadow-violet-500/20" variant="primary" onClick={handleSave} disabled={!name.trim() || !categoryId}>
            {editing === "new" ? "Create Branch" : "Save Branch"}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}

function AppAreasTab() {
  const { data, isLoading } = useAdminApplicationAreas();
  const createMutation = useCreateAdminApplicationArea();
  const updateMutation = useUpdateAdminApplicationArea();
  const deleteMutation = useDeleteAdminApplicationArea();
  const [editing, setEditing] = useState<ApplicationAreaAdmin | "new" | null>(null);
  const [name, setName] = useState("");

  const columns: Column<ApplicationAreaAdmin>[] = [
    {
      key: "name",
      header: "Application Domain",
      render: (a) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0">
            <Globe className="h-4 w-4" />
          </div>
          <span className="font-bold text-fg text-xs">{a.applicationAreaName}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (a) => (
        <div className="flex gap-1.5 justify-end">
          <button
            onClick={() => {
              setEditing(a);
              setName(a.applicationAreaName);
            }}
            className="p-1.5 rounded-lg text-muted hover:text-violet hover:bg-violet/10 border border-transparent hover:border-violet/20 transition-all cursor-pointer"
            title="Edit domain"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => confirm(`Delete application domain "${a.applicationAreaName}"?`) && deleteMutation.mutate(a.id)}
            className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Delete domain"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  const handleSave = () => {
    if (editing === "new") {
      createMutation.mutate({ applicationAreaName: name }, { onSuccess: () => setEditing(null) });
    } else if (editing) {
      updateMutation.mutate({ id: editing.id, body: { applicationAreaName: name } }, { onSuccess: () => setEditing(null) });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted">
          Industry application sectors (e.g. Healthcare, Fintech, Agriculture, Autonomous Systems).
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditing("new");
            setName("");
          }}
          className="gap-1.5 shadow-md shadow-violet-500/20"
        >
          <Plus className="h-4 w-4" /> Add Domain
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(a) => a.id}
        isLoading={isLoading}
        emptyMessage="No application domains created yet."
      />

      <FormModal open={!!editing} title={editing === "new" ? "New Application Domain" : "Edit Application Domain"} onClose={() => setEditing(null)}>
        <div className="space-y-4 text-xs">
          <Field label="Domain Name" htmlFor="app-name" required>
            <Input
              id="app-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Healthcare & Medical Diagnostics"
              required
            />
          </Field>
          <Button className="w-full shadow-md shadow-violet-500/20" variant="primary" onClick={handleSave} disabled={!name.trim()}>
            {editing === "new" ? "Create Domain" : "Save Domain"}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}

export default function AdminCollections() {
  const [tab, setTab] = useState<Tab>("categories");

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-line">
        <h1 className="font-display text-2xl font-bold text-fg flex items-center gap-2.5">
          <FolderTree className="h-6 w-6 text-violet" />
          Academic Collections & Taxonomies
        </h1>
        <p className="text-xs text-muted mt-1">
          Configure academic streams, sub-branches, and industry application areas.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 rounded-2xl border border-line bg-surface/50 p-1.5 w-fit">
        {[
          { key: "categories" as Tab, label: "Academic Streams", icon: Tags },
          { key: "subcategories" as Tab, label: "Sub-Branches", icon: Layers },
          { key: "appareas" as Tab, label: "Application Domains", icon: Globe },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer",
                tab === t.key
                  ? "bg-violet text-white shadow-md shadow-violet/20"
                  : "text-muted hover:text-fg hover:bg-surface-hi"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "categories" && <CategoriesTab />}
      {tab === "subcategories" && <SubCategoriesTab />}
      {tab === "appareas" && <AppAreasTab />}
    </div>
  );
}
