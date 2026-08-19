import { useState } from "react";
import { Trash2, Pencil, Users, Search, Mail, Phone, ShieldCheck, Sparkles, ShoppingBag } from "lucide-react";
import { useAdminUsers, useUpdateAdminUser, useDeleteAdminUser } from "@/api/admin";
import type { AdminUser } from "@/api/types";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal } from "@/components/admin/FormModal";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAdminUsers(page, search || undefined);
  const updateMutation = useUpdateAdminUser();
  const deleteMutation = useDeleteAdminUser();

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const openEdit = (user: AdminUser) => {
    setEditing(user);
    setForm({ name: user.name, email: user.email, phone: user.phone ?? "" });
  };

  const handleSave = () => {
    if (!editing) return;
    updateMutation.mutate(
      { id: editing.id, body: { name: form.name, email: form.email, phone: form.phone || null } },
      { onSuccess: () => setEditing(null) }
    );
  };

  const handleDelete = (user: AdminUser) => {
    if (!confirm(`Delete user "${user.name}"? This only works if they have no orders/wishlist/enquiries.`)) return;
    deleteMutation.mutate(user.id);
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "Student / User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet/20 to-cyan/20 border border-violet/30 text-xs font-bold text-fg shrink-0 shadow-sm">
            {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-fg text-xs block truncate">{u.name}</span>
            <span className="text-[11px] text-muted font-mono truncate block">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Contact Phone",
      render: (u) => (
        u.phone ? (
          <span className="font-mono text-xs text-fg">{u.phone}</span>
        ) : (
          <span className="text-muted text-xs">—</span>
        )
      ),
    },
    {
      key: "source",
      header: "Auth Provider",
      render: (u) => (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
            u.googleId
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-surface-hi text-muted border-line"
          }`}
        >
          {u.googleId ? "Google OAuth" : "Email & Password"}
        </span>
      ),
    },
    {
      key: "activity",
      header: "Engagement Activity",
      render: (u) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {u._count.orders} Orders
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
            {u._count.wishlist} Saved
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan/10 text-cyan border border-cyan/20">
            {u._count.enquiries} Inquiries
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (u) => (
        <div className="flex gap-1.5 justify-end">
          <button
            onClick={() => openEdit(u)}
            className="p-1.5 rounded-lg text-muted hover:text-violet hover:bg-violet/10 border border-transparent hover:border-violet/20 transition-all cursor-pointer"
            title="Edit student"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDelete(u)}
            className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Delete user"
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
            <Users className="h-6 w-6 text-violet" />
            Registered Students Directory
          </h1>
          <p className="text-xs text-muted">
            Manage student user profiles, contact credentials, and engagement activity.
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search student or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-surface-hi/60"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(u) => u.id}
        isLoading={isLoading}
        page={data?.page}
        pages={data?.pages}
        onPageChange={setPage}
        emptyMessage="No students match the search criteria."
      />

      <FormModal open={!!editing} title="Edit Student Profile" onClose={() => setEditing(null)}>
        <div className="space-y-4">
          <Field label="Full Name" htmlFor="u-name">
            <Input id="u-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email Address" htmlFor="u-email">
            <Input
              id="u-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Phone / WhatsApp Number" htmlFor="u-phone">
            <Input id="u-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Button className="w-full shadow-md shadow-violet-500/20" variant="primary" onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving changes..." : "Save Profile"}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}
