import { useState } from "react";
import { Trash2, MessageSquare, MessageCircle, ExternalLink, Phone, Mail, FolderKanban } from "lucide-react";
import { useAdminEnquiries, useUpdateAdminEnquiry, useDeleteAdminEnquiry } from "@/api/admin";
import type { AdminEnquiry } from "@/api/types";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";

const STATUS_OPTIONS = ["NEW", "CONTACTED", "CONVERTED", "CLOSED"];

function statusBadge(status: string) {
  if (status === "CONVERTED") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
  if (status === "CONTACTED") return "bg-blue-500/10 text-blue-400 border-blue-500/25";
  if (status === "NEW") return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  return "bg-surface-hi text-muted border-line";
}

export default function AdminEnquiries() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const { data, isLoading } = useAdminEnquiries(page, status || undefined);
  const updateMutation = useUpdateAdminEnquiry();
  const deleteMutation = useDeleteAdminEnquiry();

  const columns: Column<AdminEnquiry>[] = [
    {
      key: "name",
      header: "Student Inquirer",
      render: (e) => (
        <div>
          <span className="font-bold text-fg text-xs block">{e.name}</span>
          <span className="text-[11px] text-muted font-mono">{e.email}</span>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone / WhatsApp",
      render: (e) => (
        e.phone ? (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-fg">{e.phone}</span>
            <a
              href={`https://wa.me/${e.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                `Hi ${e.name}, this is HexTorq Support regarding your project inquiry for "${e.project?.projectTitle || "final year project"}". How can we assist you?`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
              title="Open WhatsApp Chat"
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          <span className="text-muted text-xs">—</span>
        )
      ),
    },
    {
      key: "project",
      header: "Project Target",
      render: (e) => (
        e.project ? (
          <span className="text-xs font-semibold text-fg line-clamp-1 max-w-[220px]" title={e.project.projectTitle}>
            {e.project.projectTitle}
          </span>
        ) : (
          <span className="text-xs text-muted italic">General Project Enquiry</span>
        )
      ),
    },
    {
      key: "message",
      header: "Inquiry Message",
      render: (e) => (
        <span className="text-xs text-muted/90 line-clamp-2 max-w-xs leading-relaxed" title={e.message}>
          {e.message}
        </span>
      ),
    },
    {
      key: "status",
      header: "Lead Status",
      render: (e) => (
        <select
          className={`rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer focus:outline-none ${statusBadge(e.status)}`}
          value={e.status}
          onChange={(ev) => updateMutation.mutate({ id: e.id, status: ev.target.value })}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-surface text-fg font-medium">
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
          className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Delete inquiry"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-fg flex items-center gap-2.5">
            <MessageSquare className="h-6 w-6 text-amber-400" />
            Student Inquiries & Leads
          </h1>
          <p className="text-xs text-muted">
            Incoming WhatsApp and web customization requests submitted by student review panels.
          </p>
        </div>

        <select
          className="rounded-xl border border-line bg-surface-hi/60 px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Lead Statuses</option>
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
        emptyMessage="No student inquiries found."
      />
    </div>
  );
}
