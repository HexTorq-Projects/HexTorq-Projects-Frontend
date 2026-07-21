import { useId } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDots,
} from "@tabler/icons-react";
import { cn } from "@/lib/cn";

interface Pagination15Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (count: number) => void;
}

export function Pagination15({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: Pagination15Props) {
  const id = useId();

  const pages: (number | "ellipsis")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (
      p === 1 ||
      p === totalPages ||
      (p >= currentPage - 1 && p <= currentPage + 1)
    ) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-6 rounded-2xl border border-neutral-200/60 bg-white/70 p-5 shadow-xl backdrop-blur-md max-sm:flex-col max-sm:justify-center max-sm:gap-4 max-sm:px-3 max-sm:py-6">
      <div className="flex shrink-0 items-center gap-4 rounded-xl border border-neutral-200/50 bg-neutral-100/50 p-1">
        <span className="pl-2 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
          Rows
        </span>
        <select
          id={id}
          value={itemsPerPage}
          onChange={(e) =>
            onItemsPerPageChange?.(Number(e.target.value))
          }
          className="h-7 w-[60px] rounded-lg border border-neutral-200 bg-white px-2 text-xs font-bold shadow-none outline-none focus:ring-2 focus:ring-violet/30"
        >
          {[10, 25, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-6 max-sm:flex-col max-sm:justify-center max-sm:gap-4">
        <p
          className="text-xs font-semibold text-neutral-500"
          aria-live="polite"
        >
          Showing{" "}
          <span className="px-1 font-bold text-violet">
            {startItem}-{endItem}
          </span>{" "}
          of{" "}
          <span className="px-1 font-bold text-neutral-900">
            {totalItems}
          </span>{" "}
          items
        </p>

        <nav className="flex items-center gap-1.5 rounded-xl bg-neutral-100/50 p-1 max-sm:flex-wrap max-sm:justify-center max-sm:gap-1">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            aria-label="Jump Start"
            className="hidden rounded-xl border border-neutral-200 bg-white p-2 shadow-sm transition-all hover:scale-105 hover:bg-neutral-100 active:scale-95 disabled:pointer-events-none disabled:opacity-40 sm:flex"
          >
            <IconChevronsLeft className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Back"
            className="rounded-lg p-2 transition-all hover:bg-white active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            <IconChevronLeft className="size-4" />
          </button>

          {pages.map((p, i) =>
            p === "ellipsis" ? (
              <span
                key={`gap-${i}`}
                title="More pages"
                className="flex size-8 items-center justify-center rounded-lg transition-all hover:bg-white active:scale-95"
              >
                <IconDots className="size-4 opacity-50" />
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg font-bold transition-all",
                  p === currentPage
                    ? "scale-110 bg-violet text-white shadow-lg shadow-violet/20 hover:bg-violet hover:text-white"
                    : "hover:bg-white"
                )}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Forward"
            className="rounded-lg p-2 transition-all hover:bg-white active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            <IconChevronRight className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            aria-label="Jump End"
            className="hidden rounded-lg border border-neutral-200 bg-white p-2 shadow-sm transition-all hover:scale-105 hover:bg-neutral-100 active:scale-95 disabled:pointer-events-none disabled:opacity-40 sm:flex"
          >
            <IconChevronsRight className="size-4" />
          </button>
        </nav>
      </div>
    </div>
  );
}
