import { useState } from "react";
import { LifeBuoy, Send, MessageSquare, Clock, User, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useAdminTickets, useReplyTicket, useUpdateTicket } from "@/api/admin";
import type { SupportTicket } from "@/api/types";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { FormModal } from "@/components/admin/FormModal";
import { Input, Field, Textarea } from "@/components/ui/Input";

function priorityBadge(priority: string) {
  if (priority === "URGENT") return "bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold";
  if (priority === "HIGH") return "bg-amber-500/15 text-amber-400 border-amber-500/30 font-semibold";
  if (priority === "MEDIUM") return "bg-violet/15 text-violet border-violet/30";
  return "bg-surface-hi text-muted border-line";
}

function statusBadge(status: string) {
  if (status === "OPEN") return "bg-rose-500/10 text-rose-400 border-rose-500/30";
  if (status === "IN_PROGRESS") return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  if (status === "RESOLVED" || status === "CLOSED") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  return "bg-surface-hi text-muted border-line";
}

export default function AdminTickets() {
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading } = useAdminTickets(statusFilter || undefined);
  const replyMutation = useReplyTicket();
  const updateMutation = useUpdateTicket();

  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    if (!activeTicket || !replyText.trim()) return;
    replyMutation.mutate(
      { id: activeTicket.id, body: replyText, status: "IN_PROGRESS" },
      {
        onSuccess: (res) => {
          setActiveTicket(res.ticket);
          setReplyText("");
        },
      }
    );
  };

  const handleStatusChange = (status: string) => {
    if (!activeTicket) return;
    updateMutation.mutate(
      { id: activeTicket.id, body: { status, priority: activeTicket.priority, assignedToId: null } },
      {
        onSuccess: (updated) => setActiveTicket(updated),
      }
    );
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Spinner className="h-8 w-8 text-cyan" />
        <span className="text-xs font-medium text-muted">Loading Support Desk Tickets...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-fg flex items-center gap-2.5">
            <LifeBuoy className="h-6 w-6 text-violet" />
            Student Support & Issue Desk
          </h1>
          <p className="text-xs text-muted">
            Manage student technical setup issues, code inquiries, and threaded resolution dialogues.
          </p>
        </div>

        <select
          className="rounded-xl border border-line bg-surface-hi px-3 py-2 text-xs text-fg cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Ticket Statuses</option>
          <option value="OPEN">OPEN (Unresolved)</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      {/* Tickets List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.items.length === 0 ? (
          <div className="col-span-full p-16 text-center text-xs text-muted glass rounded-3xl border border-line">
            No support tickets match the filter.
          </div>
        ) : (
          data.items.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveTicket(t)}
              className="glass rounded-3xl border border-line p-5 space-y-3 bg-surface/60 hover:border-violet/40 hover:bg-surface-hi/40 transition-all cursor-pointer shadow-md text-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge(t.priority)}`}>
                    {t.priority}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge(t.status)}`}>
                    {t.status}
                  </span>
                </div>

                <h3 className="font-bold text-fg text-sm line-clamp-1">{t.subject}</h3>

                <div className="p-2.5 rounded-xl border border-line bg-surface-hi/40 space-y-1">
                  <span className="text-[11px] font-bold text-fg block">{t.user.name}</span>
                  <span className="text-[10px] text-muted font-mono block">Order #{t.order.orderNumber}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-line/40 text-[10px] text-muted">
                <span>{t.messages.length} messages</span>
                <span>{new Date(t.rowCreatedTime).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ticket Thread & Reply Modal */}
      <FormModal open={!!activeTicket} title={activeTicket ? `Ticket • ${activeTicket.subject}` : ""} onClose={() => setActiveTicket(null)} wide>
        {activeTicket && (
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="flex items-center justify-between p-3 rounded-2xl border border-line bg-surface-hi/50">
              <div>
                <span className="font-bold text-fg block text-sm">{activeTicket.user.name}</span>
                <span className="text-[11px] text-muted font-mono">{activeTicket.user.email} • Order #{activeTicket.order.orderNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="rounded-xl border border-line bg-surface px-2.5 py-1 text-xs text-fg cursor-pointer"
                  value={activeTicket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>

            {/* Message Thread */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {activeTicket.messages.map((m) => {
                const isStaff = m.authorType === "STAFF";
                return (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl border ${
                      isStaff
                        ? "border-violet/30 bg-violet/10 ml-6"
                        : "border-line bg-surface-hi/60 mr-6"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[10px] text-muted">
                      <span className="font-bold text-fg">{m.authorName}</span>
                      <span>{new Date(m.rowCreatedTime).toLocaleString("en-IN", { timeStyle: "short", dateStyle: "short" })}</span>
                    </div>
                    <p className="text-xs text-fg leading-relaxed whitespace-pre-wrap">{m.body}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Input */}
            <div className="space-y-2 pt-2 border-t border-line/40">
              <Textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type response to student..."
              />
              <Button
                className="w-full shadow-md shadow-violet-500/20"
                variant="primary"
                onClick={handleSendReply}
                disabled={replyMutation.isPending || !replyText.trim()}
              >
                {replyMutation.isPending ? "Sending reply..." : "Send Staff Reply & Email Student"}
              </Button>
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
}
