import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAdminEnquiries, useUpdateAdminEnquiry, useDeleteAdminEnquiry } from "@/api/admin";
import type { AdminEnquiry } from "@/api/types";
import { DataTable, type Column } from "@/components/admin/DataTable";

const STATUS_OPTIONS = ["NEW", "CONTACTED", "CONVERTED", "CLOSED"];

export default function AdminEnquiries() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const { data, isLoading } = useAdminEnquiries(page, status || undefined);
  const updateMutation = useUpdateAdminEnquiry();
  const deleteMutation = useDeleteAdminEnquiry();

  const columns: Column<AdminEnquiry>[] = [
    { key: "name", header: "Name", render: (e) => e.name },
    { key: "email", header: "Email", render: (e) => e.email },
    { key: "phone", header: "Phone", render: (e) => e.phone ?? "—" },
    { key: "project", header: "Project", render: (e) => e.project?.projectTitle ?? "General enquiry" },
    { key: "message", header: "Message", render: (e) => <span className="line-clamp-2 max-w-xs">{e.message}</span> },
    {
      key: "status",
      header: "Status",
      render: (e) => (
        <select
          className="rounded-lg border border-line bg-bg-soft px-2 py-1.5 text-xs text-fg"
          value={e.status}
          onChange={(ev) => updateMutation.mutate({ id: e.id, status: ev.target.value })}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (e) => (
        <button
          onClick={() => confirm(`Delete enquiry from "${e.name}"?`) && deleteMutation.mutate(e.id)}
          className="text-muted hover:text-rose-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-fg">Enquiries</h1>
        <select
          className="rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(e) => e.id}
        isLoading={isLoading}
        page={data?.page}
        pages={data?.pages}
        onPageChange={setPage}
      />
    </div>
  );
}
