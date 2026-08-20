import { useState } from "react";
import {
  Kanban,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  LifeBuoy,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useAdminDeliveryBoard,
  useUpdateDeliveryStatus,
  useSendProjectPackage,
  useAdminStaff,
} from "@/api/admin";
import type { AdminOrder } from "@/api/types";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { FormModal } from "@/components/admin/FormModal";
import { Input, Field, Textarea } from "@/components/ui/Input";

const COLUMNS = [
  { key: "PACKAGE_PENDING", label: "1. Package Pending", badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { key: "PACKAGE_SENT", label: "2. Package Dispatched", badgeColor: "bg-cyan/10 text-cyan border-cyan/30" },
  { key: "SETUP_DONE", label: "3. Setup Completed", badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" },
  { key: "MEET_SCHEDULED", label: "4. Meet / Session", badgeColor: "bg-violet/10 text-violet border-violet/30" },
  { key: "COMPLETED", label: "5. Completed", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
] as const;

function slaStatus(slaDeadline?: string | null, isCompleted?: boolean) {
  if (isCompleted || !slaDeadline) return { label: "Completed", color: "text-muted border-line bg-surface-hi" };
  const diffMs = new Date(slaDeadline).getTime() - Date.now();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffHours < 0) {
    return { label: `SLA Breached (${Math.abs(diffHours)}h overdue)`, color: "bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold" };
  }
  if (diffHours <= 6) {
    return { label: `${diffHours}h remaining`, color: "bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold" };
  }
  return { label: `${diffHours}h remaining`, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold" };
}

function tierBadge(tier: string) {
  if (tier === "ELITE") return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  if (tier === "PREMIUM") return "bg-violet/15 text-violet border-violet/30";
  if (tier === "STANDARD") return "bg-cyan/15 text-cyan border-cyan/30";
  return "bg-surface-hi text-muted border-line";
}

export default function AdminDeliveryBoard() {
  const { data, isLoading } = useAdminDeliveryBoard();
  const { data: staffData } = useAdminStaff();
  const updateStatusMutation = useUpdateDeliveryStatus();
  const sendPackageMutation = useSendProjectPackage();

  const [sendingOrder, setSendingOrder] = useState<AdminOrder | null>(null);
  const [sendForm, setSendForm] = useState({
    downloadUrl: "",
    packageVersion: "v1.0.0-final",
    customNote: "",
  });

  const handleOpenSend = (order: AdminOrder) => {
    setSendingOrder(order);
    setSendForm({
      downloadUrl: `https://projects.hextorq.tech/dashboard?order=${order.orderNumber}`,
      packageVersion: "v1.0.0-final",
      customNote: "Your verified deliverables have been unlocked and attached.",
    });
  };

  const handleSendPackage = () => {
    if (!sendingOrder) return;
    sendPackageMutation.mutate(
      {
        id: sendingOrder.id,
        downloadUrl: sendForm.downloadUrl || undefined,
        packageVersion: sendForm.packageVersion,
        customNote: sendForm.customNote,
      },
      {
        onSuccess: () => setSendingOrder(null),
      }
    );
  };

  const handleQuickAdvance = (order: AdminOrder, nextStatus: string) => {
    updateStatusMutation.mutate({
      id: order.id,
      deliveryStatus: nextStatus,
      action: `Advanced to ${nextStatus}`,
    });
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Spinner className="h-8 w-8 text-cyan" />
        <span className="text-xs font-medium text-muted">Loading Delivery Kanban Board...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-fg flex items-center gap-2.5">
            <Kanban className="h-6 w-6 text-violet" />
            Deliverables Kanban Board
          </h1>
          <p className="text-xs text-muted">
            Track package dispatches, remote environment setup, Google Meet sessions, and SLA deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <Send className="h-4 w-4" />
            {data.pendingPackageCount} Pending Package Release
          </div>
          {data.slaBreachedCount > 0 && (
            <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
              {data.slaBreachedCount} SLA Breached
            </div>
          )}
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {COLUMNS.map((col) => {
          const orders = data.columns[col.key as keyof typeof data.columns] || [];
          return (
            <div key={col.key} className="flex flex-col space-y-3 min-h-[500px]">
              {/* Column Header */}
              <div className="flex items-center justify-between p-3 rounded-2xl border border-line bg-surface-hi/40">
                <span className="text-xs font-bold text-fg truncate">{col.label}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${col.badgeColor}`}>
                  {orders.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1">
                {orders.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-line/40 bg-surface/30 text-center text-xs text-muted">
                    No orders in this stage
                  </div>
                ) : (
                  orders.map((order) => {
                    const sla = slaStatus(order.slaDeadline, col.key === "COMPLETED");
                    return (
                      <div
                        key={order.id}
                        className="glass rounded-2xl border border-line p-4 space-y-3 hover:border-violet/40 transition-all bg-surface/70 shadow-md text-xs group"
                      >
                        {/* Order Header */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono font-bold text-[11px] text-fg bg-surface-hi px-1.5 py-0.5 rounded border border-line">
                            {order.orderNumber}
                          </span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${tierBadge(order.serviceTier || "BASIC")}`}>
                            {order.serviceTier || "BASIC"}
                          </span>
                        </div>

                        {/* Customer & Project Title */}
                        <div>
                          <span className="font-bold text-fg block truncate">{order.customerName}</span>
                          <span className="text-[11px] text-muted line-clamp-1 mt-0.5">
                            {order.items.map((i) => i.projectTitleSnapshot).join(", ")}
                          </span>
                        </div>

                        {/* SLA & Assignment Bar */}
                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-line/40 text-[10px]">
                          <span className={`px-2 py-0.5 rounded-full border ${sla.color} truncate`}>
                            {sla.label}
                          </span>
                          <span className="text-muted font-medium truncate">
                            {order.assignedTo ? order.assignedTo.name.split(" ")[0] : "Unassigned"}
                          </span>
                        </div>

                        {/* Stage Specific Actions */}
                        <div className="pt-2 flex flex-col gap-1.5">
                          {col.key === "PACKAGE_PENDING" && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="w-full h-8 text-[11px] gap-1 shadow-md shadow-violet-500/20"
                              onClick={() => handleOpenSend(order)}
                            >
                              <Send className="h-3 w-3" /> Send Package
                            </Button>
                          )}

                          {col.key === "PACKAGE_SENT" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-8 text-[11px] gap-1 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                              onClick={() => handleQuickAdvance(order, "SETUP_DONE")}
                            >
                              <CheckCircle2 className="h-3 w-3" /> Mark Setup Done
                            </Button>
                          )}

                          {col.key === "SETUP_DONE" && (
                            <div className="flex gap-1">
                              <Link to="/admin/calendar" className="flex-1">
                                <Button variant="outline" size="sm" className="w-full h-8 text-[11px] border-violet/30 text-violet">
                                  <Calendar className="h-3 w-3" /> Meet
                                </Button>
                              </Link>
                              <Button
                                variant="primary"
                                size="sm"
                                className="flex-1 h-8 text-[11px]"
                                onClick={() => handleQuickAdvance(order, "COMPLETED")}
                              >
                                Complete
                              </Button>
                            </div>
                          )}

                          {col.key === "MEET_SCHEDULED" && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="w-full h-8 text-[11px] gap-1 bg-emerald-600 hover:bg-emerald-500"
                              onClick={() => handleQuickAdvance(order, "COMPLETED")}
                            >
                              <CheckCircle2 className="h-3 w-3" /> Mark Completed
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Package Dispatch Modal */}
      <FormModal
        open={!!sendingOrder}
        title={sendingOrder ? `Dispatch Project Package • ${sendingOrder.orderNumber}` : ""}
        onClose={() => setSendingOrder(null)}
      >
        <div className="space-y-4 text-xs">
          <div className="rounded-xl border border-line bg-surface-hi/50 p-3 space-y-1">
            <span className="text-muted block">Recipient Student:</span>
            <span className="font-bold text-fg text-sm">{sendingOrder?.customerName} ({sendingOrder?.customerEmail})</span>
          </div>

          <Field label="Package Version Reference" htmlFor="p-ver">
            <Input
              id="p-ver"
              value={sendForm.packageVersion}
              onChange={(e) => setSendForm({ ...sendForm, packageVersion: e.target.value })}
              placeholder="e.g. v1.0.0-final"
            />
          </Field>

          <Field label="Secure Deliverables URL" htmlFor="p-url">
            <Input
              id="p-url"
              value={sendForm.downloadUrl}
              onChange={(e) => setSendForm({ ...sendForm, downloadUrl: e.target.value })}
              placeholder="https://..."
            />
          </Field>

          <Field label="Custom Dispatch Note to Student" htmlFor="p-note">
            <Textarea
              id="p-note"
              rows={3}
              value={sendForm.customNote}
              onChange={(e) => setSendForm({ ...sendForm, customNote: e.target.value })}
              placeholder="Any special setup instructions or zip passwords..."
            />
          </Field>

          <Button
            className="w-full h-11 text-sm shadow-lg shadow-violet-500/25"
            variant="primary"
            onClick={handleSendPackage}
            disabled={sendPackageMutation.isPending}
          >
            {sendPackageMutation.isPending ? "Dispatching package email..." : "Send Project Package & Notify Student"}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}
