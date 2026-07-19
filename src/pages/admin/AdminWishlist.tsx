import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAdminWishlist, useDeleteAdminWishlistEntry } from "@/api/admin";
import type { AdminWishlistEntry } from "@/api/types";
import { DataTable, type Column } from "@/components/admin/DataTable";

export default function AdminWishlist() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminWishlist(page);
  const deleteMutation = useDeleteAdminWishlistEntry();

  const columns: Column<AdminWishlistEntry>[] = [
    { key: "user", header: "User", render: (w) => `${w.user.name} (${w.user.email})` },
    { key: "project", header: "Project", render: (w) => w.project.projectTitle },
    { key: "date", header: "Saved on", render: (w) => new Date(w.rowCreatedTime).toLocaleDateString() },
    {
      key: "actions",
      header: "",
      render: (w) => (
        <button
          onClick={() => confirm("Remove this favourite?") && deleteMutation.mutate(w.id)}
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
      <h1 className="font-display text-2xl font-bold text-fg mb-6">Wishlist / Favourites</h1>
      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(w) => w.id}
        isLoading={isLoading}
        page={data?.page}
        pages={data?.pages}
        onPageChange={setPage}
      />
    </div>
  );
}
