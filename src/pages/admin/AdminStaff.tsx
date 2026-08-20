import { useState } from "react";
import { UserCheck, Plus, Shield, UserX, Mail, Lock } from "lucide-react";
import { useAdminStaff, useCreateStaff, useUpdateStaff } from "@/api/admin";
import type { StaffMember } from "@/api/types";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { FormModal } from "@/components/admin/FormModal";
import { Input, Field } from "@/components/ui/Input";

const ROLES = [
  { key: "ADMIN", label: "Operations Admin" },
  { key: "DELIVERY_SPECIALIST", label: "Deliverables Specialist" },
  { key: "SETUP_ENGINEER", label: "Remote Setup Engineer" },
  { key: "MENTOR", label: "Viva / Architecture Mentor" },
  { key: "SUPPORT_STAFF", label: "Support Staff" },
];

export default function AdminStaff() {
  const { data, isLoading } = useAdminStaff();
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "SETUP_ENGINEER",
  });

  const handleCreate = () => {
    createMutation.mutate(form, {
      onSuccess: () => {
        setCreateModalOpen(false);
        setForm({ name: "", email: "", password: "", role: "SETUP_ENGINEER" });
      },
    });
  };

  const handleToggleActive = (staff: StaffMember) => {
    updateMutation.mutate({ id: staff.id, body: { isActive: !staff.isActive } });
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Spinner className="h-8 w-8 text-cyan" />
        <span className="text-xs font-medium text-muted">Loading Staff Team...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-fg flex items-center gap-2.5">
            <UserCheck className="h-6 w-6 text-cyan" />
            Engineering & Operations Staff Team
          </h1>
          <p className="text-xs text-muted">
            Manage delivery specialists, remote setup engineers, and mentorship coordinators.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setCreateModalOpen(true)}
          className="gap-1.5 shadow-md shadow-violet-500/20"
        >
          <Plus className="h-4 w-4" /> Add Team Member
        </Button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.items.map((s) => (
          <div
            key={s.id}
            className="glass rounded-3xl border border-line p-5 space-y-4 bg-surface/60 shadow-xl text-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    s.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {s.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
                <span className="font-mono text-[10px] text-muted">
                  {s._count?.assignedOrders || 0} Assigned Orders
                </span>
              </div>

              <div>
                <span className="font-bold text-fg text-sm block">{s.name}</span>
                <span className="text-[11px] text-muted font-mono">{s.email}</span>
              </div>

              <div className="p-2 rounded-xl bg-surface-hi/40 border border-line">
                <span className="text-[11px] font-bold text-violet">{s.role.replace(/_/g, " ")}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className={`w-full h-8 text-[11px] ${
                s.isActive
                  ? "text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                  : "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              }`}
              onClick={() => handleToggleActive(s)}
            >
              {s.isActive ? "Deactivate Account" : "Re-activate Account"}
            </Button>
          </div>
        ))}
      </div>

      {/* Create Staff Modal */}
      <FormModal open={createModalOpen} title="Add Staff Team Member" onClose={() => setCreateModalOpen(false)}>
        <div className="space-y-4 text-xs">
          <Field label="Full Name" htmlFor="s-name" required>
            <Input
              id="s-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              required
            />
          </Field>

          <Field label="Work Email Address" htmlFor="s-email" required>
            <Input
              id="s-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="rahul@hextorq.tech"
              required
            />
          </Field>

          <Field label="Initial Password" htmlFor="s-pass" required>
            <Input
              id="s-pass"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••••••"
              required
            />
          </Field>

          <Field label="Operational Role" htmlFor="s-role" required>
            <select
              id="s-role"
              className="w-full rounded-xl border border-line bg-surface-hi px-3 py-2 text-xs text-fg cursor-pointer"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {ROLES.map((r) => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
          </Field>

          <Button
            className="w-full h-11 text-sm shadow-lg shadow-violet-500/25"
            variant="primary"
            onClick={handleCreate}
            disabled={createMutation.isPending || !form.name || !form.email || !form.password}
          >
            {createMutation.isPending ? "Creating account..." : "Create Team Member"}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}
