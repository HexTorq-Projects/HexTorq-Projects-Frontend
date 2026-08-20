import { useState } from "react";
import {
  RefreshCw,
  ShoppingBag,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  Download,
  Copy,
  Check,
  Send,
  Calendar,
  Layers,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import {
  useAdminOrders,
  useUpdateAdminOrder,
  useVerifyAdminOrder,
  useAdminStaff,
  useSendProjectPackage,
} from "@/api/admin";
import type { AdminOrder } from "@/api/types";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { FormModal } from "@/components/admin/FormModal";
import { Button } from "@/components/ui/Button";
import { Input, Field, Textarea } from "@/components/ui/Input";

const STATUS_OPTIONS = ["PENDING", "BOOKED", "PAID", "PAYMENT_ERROR", "FAILED", "EXPIRED", "CANCELLED"];
const PAYMENT_STATUS_OPTIONS = ["PENDING", "PARTIAL", "SUCCESS", "FAILED", "EXPIRED"];
const DELIVERY_STATUS_OPTIONS = [
  "PACKAGE_PENDING",
  "PACKAGE_SENT",
  "SETUP_DONE",
  "MEET_SCHEDULED",
  "VISIT_SCHEDULED",
  "COMPLETED",
  "FAILED",
];
const TIERS = ["BASIC", "STANDARD", "PREMIUM", "ELITE"];

function statusBadge(status: string) {
  if (status === "PAID" || status === "SUCCESS" || status === "COMPLETED") {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
  }
  if (status === "BOOKED" || status === "PARTIAL" || status === "PACKAGE_SENT" || status === "SETUP_DONE") {
    return "bg-blue-500/10 text-blue-400 border-blue-500/25";
  }
  if (status === "PENDING" || status === "PACKAGE_PENDING") {
    return "bg-amber-500/10 text-amber-400 border-amber-500/25";
  }
  return "bg-rose-500/10 text-rose-400 border-rose-500/25";
}

function tierBadge(tier: string) {
  if (tier === "ELITE") return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  if (tier === "PREMIUM") return "bg-violet/15 text-violet border-violet/30";
  if (tier === "STANDARD") return "bg-cyan/15 text-cyan border-cyan/30";
  return "bg-surface-hi text-muted border-line";
}

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [serviceTier, setServiceTier] = useState("");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading } = useAdminOrders(
    page,
    status || undefined,
    search || undefined,
    deliveryStatus || undefined,
    serviceTier || undefined
  );
  const { data: staffData } = useAdminStaff();
  const updateMutation = useUpdateAdminOrder();
  const verifyMutation = useVerifyAdminOrder();
  const sendPackageMutation = useSendProjectPackage();

  const [viewing, setViewing] = useState<AdminOrder | null>(null);
  const [form, setForm] = useState({
    status: "",
    paymentStatus: "",
    deliveryStatus: "",
    serviceTier: "",
    assignedToId: "" as string | null,
    internalNotes: "" as string | null,
  });

  const openView = (order: AdminOrder) => {
    setViewing(order);
    setForm({
      status: order.status,
      paymentStatus: order.paymentStatus,
      deliveryStatus: order.deliveryStatus || "PACKAGE_PENDING",
      serviceTier: order.serviceTier || "BASIC",
      assignedToId: order.assignedTo?.id || null,
      internalNotes: order.internalNotes || "",
    });
  };

  const handleSave = () => {
    if (!viewing) return;
    updateMutation.mutate(
      { id: viewing.id, body: form },
      {
        onSuccess: () => setViewing(null),
      }
    );
  };

  const copyOrderNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(num);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    window.open(`${import.meta.env.VITE_API_URL || "/api"}/admin/orders/export/csv`, "_blank");
  };

  const columns: Column<AdminOrder>[] = [
    {
      key: "number",
      header: "Order #",
      render: (o) => (
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-xs text-fg bg-surface-hi border border-line px-2 py-0.5 rounded-md">
            {o.orderNumber}
          </span>
          <button
            onClick={() => copyOrderNumber(o.orderNumber)}
            className="p-1 rounded hover:bg-surface-hi text-muted hover:text-fg transition-colors"
            title="Copy Order #"
          >
            {copiedId === o.orderNumber ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Student Customer",
      render: (o) => (
        <div>
          <span className="font-bold text-fg text-xs block">{o.customerName}</span>
          <span className="text-[11px] text-muted font-mono block">{o.customerEmail}</span>
          {o.customerMobile && (
            <span className="text-[10px] text-muted font-mono block">{o.customerMobile}</span>
          )}
        </div>
      ),
    },
    {
      key: "tier",
      header: "Service Tier",
      render: (o) => (
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierBadge(o.serviceTier || "BASIC")}`}>
          {o.serviceTier || "BASIC"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount (₹)",
      render: (o) => (
        <div>
          <span className="font-mono font-bold text-sm text-fg block">
            ₹{o.totalAmount.toLocaleString("en-IN")}
          </span>
          {o.status === "BOOKED" && o.balanceDue > 0 && (
            <span className="text-[10px] font-semibold text-rose-400 block">
              ₹{o.balanceDue.toLocaleString("en-IN")} due
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Order / Payment",
      render: (o) => (
        <div className="flex flex-col gap-1">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border w-fit ${statusBadge(o.status)}`}>
            {o.status}
          </span>
          <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.2 rounded-md border w-fit ${statusBadge(o.paymentStatus)}`}>
            {o.paymentStatus}
          </span>
        </div>
      ),
    },
    {
      key: "deliveryStatus",
      header: "Delivery State",
      render: (o) => (
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge(o.deliveryStatus || "PACKAGE_PENDING")}`}>
          {o.deliveryStatus || "PACKAGE_PENDING"}
        </span>
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
            Track student checkouts, delivery states, tier packages, and Pay-Panda payment verifications.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5 border-line hover:border-violet/40">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search order#/name/email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-surface-hi/60 text-xs"
          />
        </div>

        <select
          className="rounded-xl border border-line bg-surface-hi/60 px-3 py-2 text-xs text-fg cursor-pointer"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Order Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="rounded-xl border border-line bg-surface-hi/60 px-3 py-2 text-xs text-fg cursor-pointer"
          value={deliveryStatus}
          onChange={(e) => {
            setDeliveryStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Delivery Statuses</option>
          {DELIVERY_STATUS_OPTIONS.map((ds) => (
            <option key={ds} value={ds}>{ds}</option>
          ))}
        </select>

        <select
          className="rounded-xl border border-line bg-surface-hi/60 px-3 py-2 text-xs text-fg cursor-pointer"
          value={serviceTier}
          onChange={(e) => {
            setServiceTier(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Service Tiers</option>
          {TIERS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
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

      {/* Enterprise Order Detail Modal */}
      <FormModal open={!!viewing} title={viewing ? `Order Summary • ${viewing.orderNumber}` : ""} onClose={() => setViewing(null)} wide>
        {viewing && (
          <div className="space-y-5 text-xs">
            {/* Delivery Timeline Ribbon */}
            <div className="rounded-2xl border border-line bg-surface-hi/40 p-4">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-3">
                Fulfillment Lifecycle Progress
              </span>
              <div className="flex items-center justify-between text-center gap-2">
                {[
                  { label: "Order Placed", done: true },
                  { label: "Payment Verified", done: viewing.status === "PAID" || viewing.status === "BOOKED" },
                  { label: "Package Sent", done: !!viewing.packageSentAt || viewing.deliveryStatus === "PACKAGE_SENT" || viewing.deliveryStatus === "COMPLETED" },
                  { label: "Setup / Meet", done: viewing.deliveryStatus === "SETUP_DONE" || viewing.deliveryStatus === "MEET_SCHEDULED" || viewing.deliveryStatus === "COMPLETED" },
                  { label: "Completed", done: viewing.deliveryStatus === "COMPLETED" },
                ].map((step, idx) => (
                  <div key={idx} className="flex-1 space-y-1">
                    <div className={`h-2 rounded-full ${step.done ? "bg-emerald-400" : "bg-surface-hi border border-line"}`} />
                    <span className={`text-[10px] block font-semibold ${step.done ? "text-fg" : "text-muted"}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student & Deliverables Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-line bg-surface-hi/50 p-4 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-line/40">
                  <span className="text-muted">Student Name:</span>
                  <span className="font-bold text-fg">{viewing.customerName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-line/40">
                  <span className="text-muted">Email:</span>
                  <span className="font-mono text-fg">{viewing.customerEmail}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Service Tier:</span>
                  <span className={`font-bold px-2 py-0.5 rounded border ${tierBadge(viewing.serviceTier || "BASIC")}`}>
                    {viewing.serviceTier || "BASIC"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-surface-hi/60 border border-line p-4 grid grid-cols-3 gap-2 text-center items-center">
                <div>
                  <div className="text-[10px] text-muted uppercase font-bold">Total</div>
                  <div className="font-display text-base font-black text-fg mt-0.5">₹{viewing.totalAmount.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-400 uppercase font-bold">Paid</div>
                  <div className="font-display text-base font-black text-emerald-400 mt-0.5">₹{viewing.amountPaid.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div className="text-[10px] text-rose-400 uppercase font-bold">Balance</div>
                  <div className="font-display text-base font-black text-rose-400 mt-0.5">₹{viewing.balanceDue.toLocaleString("en-IN")}</div>
                </div>
              </div>
            </div>

            {/* Deliverables Item List */}
            <div>
              <h4 className="text-xs font-bold uppercase text-muted tracking-wider mb-2">Project Packages</h4>
              <div className="space-y-2">
                {viewing.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded-xl border border-line bg-surface/60">
                    <span className="font-semibold text-fg line-clamp-1">{item.projectTitleSnapshot}</span>
                    <span className="font-mono font-bold text-emerald-400 shrink-0 pl-3">₹{item.unitPrice.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operations Modifiers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <Field label="Order Status" htmlFor="o-st">
                <select
                  id="o-st"
                  className="w-full rounded-xl border border-line bg-surface-hi px-3 py-2 text-xs text-fg"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Delivery Status" htmlFor="o-dst">
                <select
                  id="o-dst"
                  className="w-full rounded-xl border border-line bg-surface-hi px-3 py-2 text-xs text-fg"
                  value={form.deliveryStatus}
                  onChange={(e) => setForm({ ...form, deliveryStatus: e.target.value })}
                >
                  {DELIVERY_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Assigned Staff" htmlFor="o-staff">
                <select
                  id="o-staff"
                  className="w-full rounded-xl border border-line bg-surface-hi px-3 py-2 text-xs text-fg"
                  value={form.assignedToId || ""}
                  onChange={(e) => setForm({ ...form, assignedToId: e.target.value || null })}
                >
                  <option value="">Unassigned</option>
                  {(staffData?.items ?? []).map((st) => (
                    <option key={st.id} value={st.id}>{st.name} ({st.role})</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Internal Admin / Staff Notes" htmlFor="o-notes">
              <Textarea
                id="o-notes"
                rows={2}
                value={form.internalNotes || ""}
                onChange={(e) => setForm({ ...form, internalNotes: e.target.value })}
                placeholder="Internal ops notes, setup tracking, student requests..."
              />
            </Field>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button className="flex-1 shadow-lg shadow-violet-500/25" variant="primary" onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving changes..." : "Save Order Changes"}
              </Button>
              {viewing.payPandaPaymentId && (
                <Button variant="outline" onClick={() => verifyMutation.mutate(viewing.id)} disabled={verifyMutation.isPending} className="gap-2">
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
