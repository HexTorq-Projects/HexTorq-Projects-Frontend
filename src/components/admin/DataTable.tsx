import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  page?: number;
  pages?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  emptyMessage = "No records found.",
  page,
  pages,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <div className="glass rounded-2xl border border-line overflow-hidden shadow-xl bg-surface/50">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-hi/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted ${
                    col.className ?? ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line/40">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-muted">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Spinner className="h-6 w-6 text-cyan" />
                    <span className="text-xs font-medium text-muted">Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-3 rounded-2xl bg-surface-hi border border-line text-muted">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-fg mt-1">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="hover:bg-surface-hi/40 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 align-middle text-fg ${col.className ?? ""}`}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {page != null && pages != null && pages > 1 && (
        <div className="flex items-center justify-between border-t border-line/60 bg-surface-hi/30 px-5 py-3.5">
          <span className="text-xs font-medium text-muted">
            Showing Page <strong className="text-fg">{page}</strong> of <strong className="text-fg">{pages}</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
              className="h-8 px-2.5 border-line hover:border-violet/40 text-muted hover:text-fg"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-semibold pl-1">Prev</span>
            </Button>
            <div className="flex gap-1 px-1">
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                let p = i + 1;
                if (pages > 5 && page > 3) {
                  p = page - 2 + i;
                  if (p > pages) p = pages - (4 - i);
                }
                return (
                  <button
                    key={p}
                    onClick={() => onPageChange?.(p)}
                    className={`h-8 min-w-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      p === page
                        ? "bg-violet text-white shadow-md shadow-violet/25"
                        : "text-muted hover:text-fg hover:bg-surface-hi"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pages}
              onClick={() => onPageChange?.(page + 1)}
              className="h-8 px-2.5 border-line hover:border-violet/40 text-muted hover:text-fg"
            >
              <span className="hidden sm:inline text-xs font-semibold pr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
