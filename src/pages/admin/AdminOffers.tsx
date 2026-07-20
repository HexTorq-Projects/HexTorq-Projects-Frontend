import { useState } from "react";
import { Trash2, Pencil, Plus, Check } from "lucide-react";
import {
  useAdminOffers,
  useCreateAdminOffer,
  useUpdateAdminOffer,
  useDeleteAdminOffer,
  useAdminCategories,
  useAdminSubCategories,
  useAdminProjects,
} from "@/api/admin";
import type { AdvanceType, Offer, OfferInput, OfferScopeType } from "@/api/types";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal } from "@/components/admin/FormModal";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const EMPTY_FORM: OfferInput = {
  name: "",
  scopeType: "ALL",
  categoryId: null,
  subCategoryId: null,
  projectIds: [],
  discountPercent: 10,
  advanceType: null,
  advanceValue: null,
  startsAt: "",
  endsAt: "",
  active: true,
};

function ProjectPicker({
  selected,
  onChange,
}: {
  selected: { id: string; projectTitle: string }[];
  onChange: (next: { id: string; projectTitle: string }[]) => void;
}) {
  const [search, setSearch] = useState("");
  const { data } = useAdminProjects(1, search || undefined);

  const toggle = (id: string, title: string) => {
    const exists = selected.some((p) => p.id === id);
    onChange(exists ? selected.filter((p) => p.id !== id) : [...selected, { id, projectTitle: title }]);
  };

  return (
    <div className="space-y-2">
      <Input placeholder="Search projects to add..." value={search} onChange={(e) => setSearch(e.target.value)} />
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1 rounded-full bg-violet/10 text-violet px-2.5 py-1 text-xs"
            >
              {p.projectTitle}
              <button onClick={() => toggle(p.id, p.projectTitle)}>×</button>
            </span>
          ))}
        </div>
      )}
      <div className="max-h-48 overflow-y-auto rounded-lg border border-line divide-y divide-line/60">
        {(data?.items ?? []).map((p) => {
          const isSelected = selected.some((s) => s.id === p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id, p.projectTitle)}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-bg-soft",
                isSelected && "bg-violet/5"
              )}
            >
              <span className="text-fg">{p.projectTitle}</span>
              {isSelected && <Check className="h-4 w-4 text-violet" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminOffers() {
  const { data, isLoading } = useAdminOffers();
  const { data: categories } = useAdminCategories();
  const { data: subCategories } = useAdminSubCategories();
  const createMutation = useCreateAdminOffer();
  const updateMutation = useUpdateAdminOffer();
  const deleteMutation = useDeleteAdminOffer();

  const [editing, setEditing] = useState<Offer | "new" | null>(null);
  const [form, setForm] = useState<OfferInput>(EMPTY_FORM);
  const [pickedProjects, setPickedProjects] = useState<{ id: string; projectTitle: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const openNew = () => {
    setEditing("new");
    setForm(EMPTY_FORM);
    setPickedProjects([]);
    setErrorMsg("");
  };

  const openEdit = (offer: Offer) => {
    setEditing(offer);
    setForm({
      name: offer.name,
      scopeType: offer.scopeType,
      categoryId: offer.categoryId,
      subCategoryId: offer.subCategoryId,
      projectIds: offer.projects.map((p) => p.project.id),
      discountPercent: offer.discountPercent,
      advanceType: offer.advanceType,
      advanceValue: offer.advanceValue,
      startsAt: toLocalInput(offer.startsAt),
      endsAt: toLocalInput(offer.endsAt),
      active: offer.active,
    });
    setPickedProjects(offer.projects.map((p) => p.project));
    setErrorMsg("");
  };

  const handleSave = () => {
    setErrorMsg("");
    const body: OfferInput = {
      ...form,
      advanceValue: form.advanceType ? form.advanceValue : null,
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: new Date(form.endsAt).toISOString(),
      projectIds: form.scopeType === "PROJECT" ? pickedProjects.map((p) => p.id) : [],
    };
    const onError = (err: any) => setErrorMsg(err.message || "Failed to save offer");
    if (editing === "new") {
      createMutation.mutate(body, { onSuccess: () => setEditing(null), onError });
    } else if (editing) {
      updateMutation.mutate({ id: editing.id, body }, { onSuccess: () => setEditing(null), onError });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const filteredSubCategories = (subCategories?.items ?? []).filter(
    (sc) => !form.categoryId || sc.categoryId === form.categoryId
  );

  const scopeLabel = (offer: Offer) => {
    if (offer.scopeType === "ALL") return "All projects";
    if (offer.scopeType === "CATEGORY") return `Category: ${offer.category?.categoryName ?? "—"}`;
    if (offer.scopeType === "SUBCATEGORY") return `Sub-category: ${offer.subCategory?.subCategoryName ?? "—"}`;
    return `${offer.projects.length} selected project${offer.projects.length === 1 ? "" : "s"}`;
  };

  const advanceLabel = (offer: Offer) => {
    if (!offer.advanceType || offer.advanceValue == null) return "—";
    return offer.advanceType === "FIXED" ? `₹${offer.advanceValue} advance` : `${offer.advanceValue}% advance`;
  };

  const isLive = (offer: Offer) => {
    const now = Date.now();
    return offer.active && new Date(offer.startsAt).getTime() <= now && new Date(offer.endsAt).getTime() >= now;
  };

  const columns: Column<Offer>[] = [
    { key: "name", header: "Name", render: (o) => o.name },
    { key: "scope", header: "Scope", render: (o) => scopeLabel(o) },
    { key: "discount", header: "Discount", render: (o) => `${o.discountPercent}%` },
    { key: "advance", header: "Pre-booking", render: (o) => advanceLabel(o) },
    {
      key: "window",
      header: "Window",
      render: (o) => (
        <span>
          {new Date(o.startsAt).toLocaleDateString()} → {new Date(o.endsAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (o) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            isLive(o) ? "bg-emerald-500/10 text-emerald-400" : "bg-bg-soft text-muted"
          )}
        >
          {isLive(o) ? "Live" : o.active ? "Scheduled/Expired" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (o) => (
        <div className="flex gap-2 justify-end">
          <button onClick={() => openEdit(o)} className="text-muted hover:text-violet">
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => confirm(`Delete offer "${o.name}"?`) && deleteMutation.mutate(o.id)}
            className="text-muted hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-fg">Offers &amp; Discount Campaigns</h1>
        <Button variant="auth" onClick={openNew}>
          <Plus className="h-4 w-4" /> New Offer
        </Button>
      </div>

      <DataTable columns={columns} rows={data?.items ?? []} rowKey={(o) => o.id} isLoading={isLoading} />

      <FormModal open={!!editing} title={editing === "new" ? "New Offer" : "Edit Offer"} onClose={() => setEditing(null)} wide>
        <div className="space-y-4">
          {errorMsg && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-rose-400">
              {errorMsg}
            </div>
          )}

          <Field label="Offer Name" htmlFor="o-name">
            <Input id="o-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>

          <Field label="Applies to" htmlFor="o-scope">
            <select
              id="o-scope"
              className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
              value={form.scopeType}
              onChange={(e) => setForm({ ...form, scopeType: e.target.value as OfferScopeType })}
            >
              <option value="ALL">All projects</option>
              <option value="CATEGORY">A category</option>
              <option value="SUBCATEGORY">A sub-category</option>
              <option value="PROJECT">Specific projects</option>
            </select>
          </Field>

          {form.scopeType === "CATEGORY" && (
            <Field label="Category" htmlFor="o-category">
              <select
                id="o-category"
                className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
                value={form.categoryId ?? ""}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value || null })}
              >
                <option value="">Select category</option>
                {categories?.items.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {form.scopeType === "SUBCATEGORY" && (
            <Field label="Sub-category" htmlFor="o-subcategory">
              <select
                id="o-subcategory"
                className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
                value={form.subCategoryId ?? ""}
                onChange={(e) => setForm({ ...form, subCategoryId: e.target.value || null })}
              >
                <option value="">Select sub-category</option>
                {filteredSubCategories.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.subCategoryName} ({sc.category.categoryName})
                  </option>
                ))}
              </select>
            </Field>
          )}

          {form.scopeType === "PROJECT" && (
            <Field label="Projects" htmlFor="o-projects">
              <ProjectPicker selected={pickedProjects} onChange={setPickedProjects} />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Discount %" htmlFor="o-discount">
              <Input
                id="o-discount"
                type="number"
                min={1}
                max={100}
                value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
              />
            </Field>
            <Field label="Active" htmlFor="o-active">
              <label className="flex items-center gap-2 h-11">
                <input
                  id="o-active"
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4"
                />
                <span className="text-sm text-fg">Offer is active</span>
              </label>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Pre-booking option" htmlFor="o-advance-type" hint="Let customers reserve this offer by paying only part of the price now">
              <select
                id="o-advance-type"
                className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
                value={form.advanceType ?? ""}
                onChange={(e) =>
                  setForm({ ...form, advanceType: (e.target.value || null) as AdvanceType | null, advanceValue: null })
                }
              >
                <option value="">None</option>
                <option value="FIXED">Fixed ₹ amount</option>
                <option value="PERCENT">Percentage of price</option>
              </select>
            </Field>
            {form.advanceType && (
              <Field label={form.advanceType === "FIXED" ? "Advance Amount (₹)" : "Advance Percent (%)"} htmlFor="o-advance-value">
                <Input
                  id="o-advance-value"
                  type="number"
                  min={1}
                  max={form.advanceType === "PERCENT" ? 100 : undefined}
                  value={form.advanceValue ?? ""}
                  onChange={(e) => setForm({ ...form, advanceValue: e.target.value ? Number(e.target.value) : null })}
                />
              </Field>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Starts At" htmlFor="o-starts">
              <Input
                id="o-starts"
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              />
            </Field>
            <Field label="Ends At (order before)" htmlFor="o-ends">
              <Input
                id="o-ends"
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
              />
            </Field>
          </div>

          <Button
            className="w-full"
            variant="auth"
            onClick={handleSave}
            disabled={isSaving || !form.name || !form.startsAt || !form.endsAt}
          >
            {isSaving ? "Saving..." : "Save Offer"}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}
