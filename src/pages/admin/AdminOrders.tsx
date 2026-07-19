import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useAdminOrders, useUpdateAdminOrder, useVerifyAdminOrder } from "@/api/admin";
import type { AdminOrder } from "@/api/types";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal } from "@/components/admin/FormModal";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";

const STATUS_OPTIONS = ["PENDING", "BOOKED", "PAID", "PAYMENT_ERROR", "FAILED", "EXPIRED", "CANCELLED"];
const PAYMENT_STATUS_OPTIONS = ["PENDING", "PARTIAL", "SUCCESS", "FAILED", "EXPIRED"];

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
    { key: "number", header: "Order #", render: (o) => o.orderNumber },
    { key: "customer", header: "Customer", render: (o) => `${o.customerName} (${o.customerEmail})` },
    { key: "amount", header: "Amount", render: (o) => `₹${o.totalAmount.toLocaleString("en-IN")}` },
    { key: "type", header: "Type", render: (o) => o.paymentType },
    { key: "status", header: "Status", render: (o) => o.status },
    {
      key: "paymentStatus",
      header: "Payment",
      render: (o) =>
        o.status === "BOOKED" ? `PARTIAL (₹${o.balanceDue.toLocaleString("en-IN")} due)` : o.paymentStatus,
    },
    { key: "date", header: "Date", render: (o) => new Date(o.rowCreatedTime).toLocaleDateString() },
    {
      key: "actions",
      header: "",
      render: (o) => (
        <Button variant="outline" size="sm" onClick={() => openView(o)}>
          View
        </Button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="font-display text-2xl font-bold text-fg">Orders</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search order#/name/email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
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
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(o) => o.id}
        isLoading={isLoading}
        page={data?.page}
        pages={data?.pages}
        onPageChange={setPage}
      />

      <FormModal open={!!viewing} title={viewing ? `Order ${viewing.orderNumber}` : ""} onClose={() => setViewing(null)} wide>
        {viewing && (
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted mb-2">Items</h4>
              <div className="space-y-1.5 text-sm">
                {viewing.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-fg">{item.projectTitleSnapshot}</span>
                    <span className="text-muted">₹{item.unitPrice.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-bg-soft border border-line p-3 grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted">Total</div>
                <div className="font-semibold text-fg">₹{viewing.totalAmount.toLocaleString("en-IN")}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Paid</div>
                <div className="font-semibold text-fg">₹{viewing.amountPaid.toLocaleString("en-IN")}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Balance Due</div>
                <div className="font-semibold text-fg">₹{viewing.balanceDue.toLocaleString("en-IN")}</div>
              </div>
            </div>

            {viewing.payments.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted mb-2">Payment attempts</h4>
                <div className="space-y-1.5 text-sm">
                  {viewing.payments.map((p) => (
                    <div key={p.id} className="flex justify-between border-b border-line/50 pb-1.5">
                      <span className="text-fg">
                        {p.purpose} · ₹{p.amount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-muted">{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Status" htmlFor="o-status">
                <select
                  id="o-status"
                  className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
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
              <Field label="Payment Status" htmlFor="o-payment">
                <select
                  id="o-payment"
                  className="w-full rounded-xl border border-line bg-bg-soft px-4 py-2.5 text-sm text-fg"
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

            <div className="flex gap-3">
              <Button className="flex-1" variant="auth" onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Status"}
              </Button>
              {viewing.payPandaPaymentId && (
                <Button
                  variant="outline"
                  onClick={() => verifyMutation.mutate(viewing.id)}
                  disabled={verifyMutation.isPending}
                >
                  <RefreshCw className="h-4 w-4" /> Verify with Pay-Panda
                </Button>
              )}
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
}
