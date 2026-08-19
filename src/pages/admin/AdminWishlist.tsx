import { useState } from "react";
import { Trash2, Heart, ExternalLink, Users, FolderKanban } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminWishlist, useDeleteAdminWishlistEntry } from "@/api/admin";
import type { AdminWishlistEntry } from "@/api/types";
import { DataTable, type Column } from "@/components/admin/DataTable";

export default function AdminWishlist() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminWishlist(page);
  const deleteMutation = useDeleteAdminWishlistEntry();

  const columns: Column<AdminWishlistEntry>[] = [
    {
      key: "user",
      header: "Student User",
      render: (w) => (
        <div>
          <span className="font-bold text-fg text-xs block">{w.user.name}</span>
          <span className="text-[11px] text-muted font-mono">{w.user.email}</span>
        </div>
      ),
    },
    {
      key: "project",
      header: "Saved Project Title",
      render: (w) => (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-fg line-clamp-1 max-w-md">
            {w.project.projectTitle}
          </span>
          <Link
            to={`/project/${w.project.id}`}
            target="_blank"
            className="text-muted hover:text-cyan p-1 rounded hover:bg-surface-hi transition-colors shrink-0"
            title="View project page"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      ),
    },
    {
      key: "date",
      header: "Saved Date",
      render: (w) => (
        <span className="text-xs text-muted">
          {new Date(w.rowCreatedTime).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (w) => (
        <button
          onClick={() => confirm(`Remove wishlist item for "${w.user.name}"?`) && deleteMutation.mutate(w.id)}
          className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Remove favourite"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-line">
        <h1 className="font-display text-2xl font-bold text-fg flex items-center gap-2.5">
          <Heart className="h-6 w-6 text-rose-500" />
          Student Wishlist & Favorites Analytics
        </h1>
        <p className="text-xs text-muted mt-1">
          Monitor projects saved by students to gauge topic interest and conversion potential.
        </p>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(w) => w.id}
        isLoading={isLoading}
        page={data?.page}
        pages={data?.pages}
        onPageChange={setPage}
        emptyMessage="No students have saved projects to wishlist yet."
      />
    </div>
  );
}
