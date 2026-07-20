import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
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
    { key: "name", header: "Name", render: (u) => u.name },
    { key: "email", header: "Email", render: (u) => u.email },
    { key: "phone", header: "Phone", render: (u) => u.phone ?? "—" },
    { key: "source", header: "Signed up via", render: (u) => (u.googleId ? "Google" : "Password") },
    {
      key: "activity",
      header: "Activity",
      render: (u) => `${u._count.orders} orders · ${u._count.wishlist} saved · ${u._count.enquiries} enquiries`,
    },
    {
      key: "actions",
      header: "",
      render: (u) => (
        <div className="flex gap-2 justify-end">
          <button onClick={() => openEdit(u)} className="text-muted hover:text-violet">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(u)} className="text-muted hover:text-rose-400">
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
        <h1 className="font-display text-2xl font-bold text-fg">Users</h1>
        <Input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
        />
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(u) => u.id}
        isLoading={isLoading}
        page={data?.page}
        pages={data?.pages}
        onPageChange={setPage}
      />

      <FormModal open={!!editing} title="Edit User" onClose={() => setEditing(null)}>
        <div className="space-y-4">
          <Field label="Name" htmlFor="u-name">
            <Input id="u-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email" htmlFor="u-email">
            <Input
              id="u-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Phone" htmlFor="u-phone">
            <Input id="u-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Button className="w-full" variant="auth" onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}
