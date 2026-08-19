import { useState } from "react";
import { RefreshCw, ShoppingBag, Search, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, Clock, CreditCard } from "lucide-react";
import { useAdminOrders, useUpdateAdminOrder, useVerifyAdminOrder } from "@/api/admin";
import type { AdminOrder } from "@/api/types";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal } from "@/components/admin/FormModal";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";

const STATUS_OPTIONS = ["PENDING", "BOOKED", "PAID", "PAYMENT_ERROR", "FAILED", "EXPIRED", "CANCELLED"];
const PAYMENT_STATUS_OPTIONS = ["PENDING", "PARTIAL", "SUCCESS", "FAILED", "EXPIRED"];

function statusBadge(status: string) {
  if (status === "PAID" || status === "SUCCESS") {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
  }
  if (status === "BOOKED" || status === "PARTIAL") {
    return "bg-blue-500/10 text-blue-400 border-blue-500/25";
  }
  if (status === "PENDING") {
    return "bg-amber-500/10 text-amber-400 border-amber-500/25";
  }
  return "bg-rose-500/10 text-rose-400 border-rose-500/25";
}

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAdminOrders(page, status || undefined, search || undefined);
  const updateMutation = useUpdateAdminOrder();
  const verifyMutation = useVerifyAdminOrder();

  const [viewing, setViewing] = useState<AdminOrder | null>(null);
  const [form, setForm] = useState({ status: "", paymentStatus: "" });

  const openView = (order: AdminOrder) => {
    setViewing(order);
    setForm({ status: order.status, paymentStatus: order.paymentStatus });
  };

  const handleSave = () => {
    if (!viewing) return;
    updateMutation.mutate({ id: viewing.id, body: form }, { onSuccess: () => setViewing(null) });
  };

  const columns: Column<AdminOrder>[] = [
    {
      key: "number",
      header: "Order Reference",
      render: (o) => (
        <div>
          <span className="font-mono font-bold text-xs text-fg bg-surface-hi border border-line px-2 py-0.5 rounded-md">
            {o.orderNumber}
          </span>
          <span className="text-[10px] text-muted block pt-1">
            {new Date(o.rowCreatedTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </span>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Student Customer",
      render: (o) => (
        <div>
          <span className="font-bold text-fg text-xs block">{o.customerName}</span>
          <span className="text-[11px] text-muted font-mono">{o.customerEmail}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Total Amount",
      render: (o) => (
        <div>
          <span className="font-mono font-bold text-sm text-fg block">
            ₹{o.totalAmount.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] font-semibold text-muted uppercase">
            {o.paymentType === "ADVANCE" ? "Advance Deposit" : "Full Payment"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Order Status",
      render: (o) => (
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge(o.status)}`}>
          {o.status === "BOOKED" ? "BOOKED (PARTIAL)" : o.status}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment Status",
      render: (o) => (
        <div>
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge(o.paymentStatus)}`}>
            {o.paymentStatus}
          </span>
          {o.status === "BOOKED" && o.balanceDue > 0 && (
            <span className="text-[10px] font-semibold text-rose-400 block pt-0.5">
              ₹{o.balanceDue.toLocaleString("en-IN")} due
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (o) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => openView(o)}
          className="text-xs h-8 px-3 border-line hover:border-violet/40 hover:text-violet"
        >
          View Details
        </Button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-fg flex items-center gap-2.5">
            <ShoppingBag className="h-6 w-6 text-indigo-400" />
            Orders & Pay-Panda Checkouts
          </h1>
          <p className="text-xs text-muted">
            Track student checkouts, payment verification states, balance clearances, and gateway webhooks.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              placeholder="Search order#/email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 bg-surface-hi/60 text-xs"
            />
          </div>
          <select
            className="rounded-xl border border-line bg-surface-hi/60 px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
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
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(o) => o.id}
        isLoading={isLoading}
        page={data?.page}
        pages={data?.pages}
        onPageChange={setPage}
        emptyMessage="No orders found matching the filter criteria."
      />

      {/* Order Details & Status Manager Modal */}
      <FormModal open={!!viewing} title={viewing ? `Order Summary • ${viewing.orderNumber}` : ""} onClose={() => setViewing(null)} wide>
        {viewing && (
          <div className="space-y-5 text-xs">
            {/* Customer & Info Pill */}
            <div className="rounded-2xl border border-line bg-surface-hi/50 p-4 space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-line/40">
                <span className="text-muted">Customer Name:</span>
                <span className="font-bold text-fg text-sm">{viewing.customerName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-line/40">
                <span className="text-muted">Customer Email:</span>
                <span className="font-mono text-fg">{viewing.customerEmail}</span>
              </div>
              {viewing.customerMobile && (
                <div className="flex justify-between items-center pb-2 border-b border-line/40">
                  <span className="text-muted">Mobile / WhatsApp:</span>
                  <span className="font-mono text-fg">{viewing.customerMobile}</span>
                </div>
              )}
              {viewing.referralCode && (
                <div className="flex justify-between items-center">
                  <span className="text-muted">Referral Attribution:</span>
                  <span className="font-mono font-bold text-cyan bg-cyan/10 px-2 py-0.5 rounded border border-cyan/20">
                    {viewing.referralCode}
                  </span>
                </div>
              )}
            </div>

            {/* Purchased Packages List */}
            <div>
              <h4 className="text-xs font-bold uppercase text-muted tracking-wider mb-2.5">
                Purchased Project Packages
              </h4>
              <div className="space-y-2">
                {viewing.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3.5 rounded-xl border border-line bg-surface/60"
                  >
                    <span className="font-semibold text-fg text-xs line-clamp-1">{item.projectTitleSnapshot}</span>
                    <span className="font-mono font-bold text-sm text-emerald-400 shrink-0 pl-3">
                      ₹{item.unitPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="rounded-2xl bg-surface-hi/60 border border-line p-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-[11px] text-muted uppercase font-bold">Total Payable</div>
                <div className="font-display text-lg font-black text-fg mt-0.5">
                  ₹{viewing.totalAmount.toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-emerald-400 uppercase font-bold">Amount Paid</div>
                <div className="font-display text-lg font-black text-emerald-400 mt-0.5">
                  ₹{viewing.amountPaid.toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-rose-400 uppercase font-bold">Balance Due</div>
                <div className="font-display text-lg font-black text-rose-400 mt-0.5">
                  ₹{viewing.balanceDue.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Status Modifiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Field label="Overall Order Status" htmlFor="o-status">
                <select
                  id="o-status"
                  className="w-full rounded-xl border border-line bg-surface-hi px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Payment Gateway Status" htmlFor="o-payment">
                <select
                  id="o-payment"
                  className="w-full rounded-xl border border-line bg-surface-hi px-3.5 py-2.5 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
                  value={form.paymentStatus}
                  onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                >
                  {PAYMENT_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                className="flex-1 shadow-lg shadow-violet-500/25"
                variant="primary"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving status..." : "Save Order Changes"}
              </Button>
              {viewing.payPandaPaymentId && (
                <Button
                  variant="outline"
                  onClick={() => verifyMutation.mutate(viewing.id)}
                  disabled={verifyMutation.isPending}
                  className="gap-2 border-line hover:border-cyan/40 hover:text-cyan"
                >
                  <RefreshCw className={`h-4 w-4 ${verifyMutation.isPending ? "animate-spin" : ""}`} />
                  Re-Verify with Pay-Panda
                </Button>
              )}
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
}
