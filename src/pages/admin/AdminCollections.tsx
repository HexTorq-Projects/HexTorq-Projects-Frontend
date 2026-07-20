import { useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
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
    { key: "name", header: "Category Name", render: (c) => c.categoryName },
    {
      key: "actions",
      header: "",
      render: (c) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              setEditing(c);
              setName(c.categoryName);
            }}
            className="text-muted hover:text-violet"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => confirm(`Delete category "${c.categoryName}"?`) && deleteMutation.mutate(c.id)}
            className="text-muted hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
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
    <div>
      <div className="flex justify-end mb-4">
        <Button
          variant="auth"
          size="sm"
          onClick={() => {
            setEditing("new");
            setName("");
          }}
        >
          <Plus className="h-4 w-4" /> New Category
        </Button>
      </div>
      <DataTable columns={columns} rows={data?.items ?? []} rowKey={(c) => c.id} isLoading={isLoading} />
      <FormModal open={!!editing} title={editing === "new" ? "New Category" : "Edit Category"} onClose={() => setEditing(null)}>
        <div className="space-y-4">
          <Field label="Category Name" htmlFor="cat-name">
            <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Button className="w-full" variant="auth" onClick={handleSave} disabled={!name.trim()}>
            Save
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
  const [form, setForm] = useState({ subCategoryName: "", categoryId: "" });

  const columns: Column<SubCategoryAdmin>[] = [
    { key: "name", header: "Sub-category Name", render: (sc) => sc.subCategoryName },
    { key: "category", header: "Category", render: (sc) => sc.category.categoryName },
    {
      key: "actions",
      header: "",
      render: (sc) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              setEditing(sc);
              setForm({ subCategoryName: sc.subCategoryName, categoryId: sc.categoryId });
            }}
            className="text-muted hover:text-violet"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => confirm(`Delete sub-category "${sc.subCategoryName}"?`) && deleteMutation.mutate(sc.id)}
            className="text-muted hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  const handleSave = () => {
    if (editing === "new") {
      createMutation.mutate(form, { onSuccess: () => setEditing(null) });
    } else if (editing) {
      updateMutation.mutate({ id: editing.id, body: form }, { onSuccess: () => setEditing(null) });
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          variant="auth"
          size="sm"
          onClick={() => {
            setEditing("new");
            setForm({ subCategoryName: "", categoryId: categories?.items[0]?.id ?? "" });
          }}
        >
          <Plus className="h-4 w-4" /> New Sub-category
        </Button>
      </div>
      <DataTable columns={columns} rows={data?.items ?? []} rowKey={(sc) => sc.id} isLoading={isLoading} />
      <FormModal
        open={!!editing}
        title={editing === "new" ? "New Sub-category" : "Edit Sub-category"}
        onClose={() => setEditing(null)}
      >
        <div className="space-y-4">
          <Field label="Sub-category Name" htmlFor="sc-name">
            <Input
              id="sc-name"
              value={form.subCategoryName}
              onChange={(e) => setForm({ ...form, subCategoryName: e.target.value })}
            />
          </Field>
          <Field label="Category" htmlFor="sc-category">
            <select
              id="sc-category"
              className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {categories?.items.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </Field>
          <Button className="w-full" variant="auth" onClick={handleSave} disabled={!form.subCategoryName.trim() || !form.categoryId}>
            Save
          </Button>
        </div>
      </FormModal>
    </div>
  );
}

function ApplicationAreasTab() {
  const { data, isLoading } = useAdminApplicationAreas();
  const createMutation = useCreateAdminApplicationArea();
  const updateMutation = useUpdateAdminApplicationArea();
  const deleteMutation = useDeleteAdminApplicationArea();
  const [editing, setEditing] = useState<ApplicationAreaAdmin | "new" | null>(null);
  const [name, setName] = useState("");

  const columns: Column<ApplicationAreaAdmin>[] = [
    { key: "name", header: "Application Area", render: (a) => a.applicationAreaName },
    {
      key: "actions",
      header: "",
      render: (a) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              setEditing(a);
              setName(a.applicationAreaName);
            }}
            className="text-muted hover:text-violet"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => confirm(`Delete application area "${a.applicationAreaName}"?`) && deleteMutation.mutate(a.id)}
            className="text-muted hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
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
    <div>
      <div className="flex justify-end mb-4">
        <Button
          variant="auth"
          size="sm"
          onClick={() => {
            setEditing("new");
            setName("");
          }}
        >
          <Plus className="h-4 w-4" /> New Application Area
        </Button>
      </div>
      <DataTable columns={columns} rows={data?.items ?? []} rowKey={(a) => a.id} isLoading={isLoading} />
      <FormModal
        open={!!editing}
        title={editing === "new" ? "New Application Area" : "Edit Application Area"}
        onClose={() => setEditing(null)}
      >
        <div className="space-y-4">
          <Field label="Name" htmlFor="aa-name">
            <Input id="aa-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Button className="w-full" variant="auth" onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        </div>
      </FormModal>
    </div>
  );
}

export default function AdminCollections() {
  const [tab, setTab] = useState<Tab>("categories");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fg mb-6">Collections</h1>
      <div className="flex gap-2 mb-6 border-b border-line">
        {[
          { id: "categories" as const, label: "Categories" },
          { id: "subcategories" as const, label: "Sub-categories" },
          { id: "appareas" as const, label: "Application Areas" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === t.id ? "border-violet text-violet" : "border-transparent text-muted hover:text-fg"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "categories" && <CategoriesTab />}
      {tab === "subcategories" && <SubCategoriesTab />}
      {tab === "appareas" && <ApplicationAreasTab />}
    </div>
  );
}
