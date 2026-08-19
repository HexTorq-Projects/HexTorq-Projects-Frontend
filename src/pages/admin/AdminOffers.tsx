import { useState } from "react";
import { Trash2, Pencil, Plus, Check, Percent, Tag, Calendar, Sparkles, Clock, AlertCircle } from "lucide-react";
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
    <div className="space-y-3">
      <Input
        placeholder="Search projects by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-surface-hi"
      />
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-surface-hi/40 border border-line max-h-24 overflow-y-auto">
          {selected.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1 rounded-full bg-violet/10 border border-violet/30 text-violet px-2.5 py-0.5 text-xs font-semibold"
            >
              <span className="truncate max-w-[180px]">{p.projectTitle}</span>
              <button onClick={() => toggle(p.id, p.projectTitle)} className="hover:text-rose-400 font-bold ml-1">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="max-h-48 overflow-y-auto rounded-2xl border border-line divide-y divide-line/40 bg-surface/40">
        {(data?.items ?? []).map((p) => {
          const isSelected = selected.some((s) => s.id === p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id, p.projectTitle)}
              className={cn(
                "flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-surface-hi",
                isSelected && "bg-violet/10 text-violet"
              )}
            >
              <span className="font-semibold line-clamp-1 pr-2">{p.projectTitle}</span>
              {isSelected && <Check className="h-4 w-4 text-violet shrink-0" />}
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
    if (offer.scopeType === "ALL") return "All 3,800+ Projects";
    if (offer.scopeType === "CATEGORY") return `Stream: ${offer.category?.categoryName ?? "—"}`;
    if (offer.scopeType === "SUBCATEGORY") return `Branch: ${offer.subCategory?.subCategoryName ?? "—"}`;
    return `${offer.projects.length} Selected Project${offer.projects.length === 1 ? "" : "s"}`;
  };

  const advanceLabel = (offer: Offer) => {
    if (!offer.advanceType || offer.advanceValue == null) return "—";
    return offer.advanceType === "FIXED" ? `₹${offer.advanceValue} deposit` : `${offer.advanceValue}% deposit`;
  };

  const isLive = (offer: Offer) => {
    const now = Date.now();
    return offer.active && new Date(offer.startsAt).getTime() <= now && new Date(offer.endsAt).getTime() >= now;
  };

  const columns: Column<Offer>[] = [
    {
      key: "name",
      header: "Offer Name",
      render: (o) => (
        <div>
          <span className="font-bold text-fg text-xs block">{o.name}</span>
          <span className="text-[11px] text-muted">{scopeLabel(o)}</span>
        </div>
      ),
    },
    {
      key: "discount",
      header: "Discount %",
      render: (o) => (
        <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
          {o.discountPercent}% OFF
        </span>
      ),
    },
    {
      key: "advance",
      header: "Pre-Booking Deposit",
      render: (o) => (
        <span className="text-xs font-semibold text-fg">
          {advanceLabel(o)}
        </span>
      ),
    },
    {
      key: "window",
      header: "Active Schedule",
      render: (o) => (
        <span className="text-[11px] text-muted">
          {new Date(o.startsAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} →{" "}
          {new Date(o.endsAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (o) => {
        const live = isLive(o);
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
              live
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : o.active
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : "bg-surface-hi text-muted border-line"
            )}
          >
            {live ? "LIVE NOW" : o.active ? "SCHEDULED" : "DISABLED"}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "",
      render: (o) => (
        <div className="flex gap-1.5 justify-end">
          <button
            onClick={() => openEdit(o)}
            className="p-1.5 rounded-lg text-muted hover:text-violet hover:bg-violet/10 border border-transparent hover:border-violet/20 transition-all cursor-pointer"
            title="Edit offer"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => confirm(`Delete offer "${o.name}"?`) && deleteMutation.mutate(o.id)}
            className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Delete offer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-fg flex items-center gap-2.5">
            <Percent className="h-6 w-6 text-rose-400" />
            Promotions & Flash Deals
          </h1>
          <p className="text-xs text-muted">
            Configure site-wide discounts, category sales, and pre-booking advance deposit schemes.
          </p>
        </div>

        <Button variant="primary" onClick={openNew} className="gap-1.5 shadow-md shadow-violet-500/20">
          <Plus className="h-4 w-4" />
          Create New Offer
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(o) => o.id}
        isLoading={isLoading}
        emptyMessage="No active or scheduled promotions found."
      />

      <FormModal open={!!editing} title={editing === "new" ? "Create New Promotion" : "Edit Promotion"} onClose={() => setEditing(null)} wide>
        <div className="space-y-4 text-xs">
          {errorMsg && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <Field label="Promotion Name" htmlFor="o-name" required>
            <Input
              id="o-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Flash Final Year Sale • 15% Off"
              required
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Offer Target Scope" htmlFor="o-scope">
              <select
                id="o-scope"
                className="w-full rounded-xl border border-line bg-surface-hi px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
                value={form.scopeType}
                onChange={(e) => setForm({ ...form, scopeType: e.target.value as OfferScopeType })}
              >
                <option value="ALL">All Projects Site-Wide</option>
                <option value="CATEGORY">Specific Academic Stream</option>
                <option value="SUBCATEGORY">Specific Sub-Branch</option>
                <option value="PROJECT">Custom Selected Projects</option>
              </select>
            </Field>

            <Field label="Discount Percentage (%)" htmlFor="o-disc" required>
              <Input
                id="o-disc"
                type="number"
                min={1}
                max={99}
                value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                required
              />
            </Field>
          </div>

          {form.scopeType === "CATEGORY" && (
            <Field label="Select Academic Stream" htmlFor="o-cat" required>
              <select
                id="o-cat"
                className="w-full rounded-xl border border-line bg-surface-hi px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
                value={form.categoryId ?? ""}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value || null })}
              >
                <option value="">Select category...</option>
                {categories?.items.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {form.scopeType === "SUBCATEGORY" && (
            <Field label="Select Sub-Branch" htmlFor="o-subcat" required>
              <select
                id="o-subcat"
                className="w-full rounded-xl border border-line bg-surface-hi px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
                value={form.subCategoryId ?? ""}
                onChange={(e) => setForm({ ...form, subCategoryId: e.target.value || null })}
              >
                <option value="">Select sub-category...</option>
                {subCategories?.items.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.subCategoryName}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {form.scopeType === "PROJECT" && (
            <div>
              <span className="text-xs font-bold text-fg block mb-1">Pick Projects</span>
              <ProjectPicker selected={pickedProjects} onChange={setPickedProjects} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Start Date & Time" htmlFor="o-start" required>
              <Input
                id="o-start"
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                required
              />
            </Field>
            <Field label="End Date & Time" htmlFor="o-end" required>
              <Input
                id="o-end"
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                required
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
              {isSaving ? "Saving promotion..." : editing === "new" ? "Create Promotion" : "Save Changes"}
            </Button>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
