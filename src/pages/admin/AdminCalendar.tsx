import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Video,
  MapPin,
  Clock,
  Plus,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import { useAdminCalendar, useScheduleMeet, useUpdateMeet, useScheduleVisit } from "@/api/admin";
import type { MeetSchedule, VisitSchedule } from "@/api/types";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { FormModal } from "@/components/admin/FormModal";
import { Input, Field, Textarea } from "@/components/ui/Input";

export default function AdminCalendar() {
  const [tab, setTab] = useState<"meets" | "visits">("meets");
  const { data, isLoading } = useAdminCalendar();
  const scheduleMeetMutation = useScheduleMeet();
  const updateMeetMutation = useUpdateMeet();
  const scheduleVisitMutation = useScheduleVisit();

  const [meetModalOpen, setMeetModalOpen] = useState(false);
  const [meetForm, setMeetForm] = useState({
    orderId: "",
    scheduledAt: "",
    meetLink: "",
    note: "",
  });

  const handleScheduleMeet = () => {
    scheduleMeetMutation.mutate(
      {
        orderId: meetForm.orderId,
        scheduledAt: new Date(meetForm.scheduledAt).toISOString(),
        meetLink: meetForm.meetLink || undefined,
        note: meetForm.note || undefined,
      },
      {
        onSuccess: () => {
          setMeetModalOpen(false);
          setMeetForm({ orderId: "", scheduledAt: "", meetLink: "", note: "" });
        },
      }
    );
  };

  const handleUpdateMeetStatus = (id: string, status: "CONFIRMED" | "COMPLETED" | "CANCELLED") => {
    updateMeetMutation.mutate({ id, status });
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Spinner className="h-8 w-8 text-cyan" />
        <span className="text-xs font-medium text-muted">Loading Calendar Sessions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-fg flex items-center gap-2.5">
            <CalendarIcon className="h-6 w-6 text-cyan" />
            Technical Mentorship & Sessions Calendar
          </h1>
          <p className="text-xs text-muted">
            Manage scheduled 1-on-1 Google Meet architecture reviews and on-site demonstrations.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setMeetModalOpen(true)}
          className="gap-1.5 shadow-md shadow-violet-500/20"
        >
          <Plus className="h-4 w-4" /> Schedule Google Meet
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-2xl border border-line bg-surface/50 p-1.5 w-fit">
        <button
          onClick={() => setTab("meets")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            tab === "meets"
              ? "bg-violet text-white shadow-md shadow-violet/20"
              : "text-muted hover:text-fg hover:bg-surface-hi"
          }`}
        >
          <Video className="h-4 w-4" />
          Google Meets ({data.meets.length})
        </button>

        <button
          onClick={() => setTab("visits")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            tab === "visits"
              ? "bg-violet text-white shadow-md shadow-violet/20"
              : "text-muted hover:text-fg hover:bg-surface-hi"
          }`}
        >
          <MapPin className="h-4 w-4" />
          Direct Visits ({data.visits.length})
        </button>
      </div>

      {/* Meets Tab Content */}
      {tab === "meets" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.meets.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs text-muted glass rounded-3xl border border-line">
              No Google Meet sessions scheduled yet.
            </div>
          ) : (
            data.meets.map((m) => (
              <div
                key={m.id}
                className="glass rounded-3xl border border-line p-5 space-y-4 bg-surface/60 shadow-xl text-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-fg bg-surface-hi px-2 py-0.5 rounded border border-line">
                      {m.order?.orderNumber || "Session"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        m.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : m.status === "CANCELLED"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-cyan/10 text-cyan border-cyan/20"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-fg block text-sm">{m.order?.customerName}</span>
                    <span className="text-[11px] text-muted font-mono">{m.order?.customerEmail}</span>
                  </div>

                  <div className="p-3 rounded-2xl border border-line bg-surface-hi/40 space-y-1.5">
                    <div className="flex items-center gap-2 text-fg font-medium">
                      <Clock className="h-3.5 w-3.5 text-cyan shrink-0" />
                      <span>
                        {new Date(m.scheduledAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    {m.meetLink && (
                      <a
                        href={m.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan hover:underline flex items-center gap-1 font-mono font-semibold"
                      >
                        <Video className="h-3.5 w-3.5" /> Join Google Meet <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-line/40">
                  {m.status !== "COMPLETED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-[11px] text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                      onClick={() => handleUpdateMeetStatus(m.id, "COMPLETED")}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark Done
                    </Button>
                  )}
                  {m.status !== "CANCELLED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-[11px] text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                      onClick={() => handleUpdateMeetStatus(m.id, "CANCELLED")}
                    >
                      <XCircle className="h-3.5 w-3.5" /> Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Visits Tab Content */}
      {tab === "visits" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.visits.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs text-muted glass rounded-3xl border border-line">
              No direct campus visits scheduled yet.
            </div>
          ) : (
            data.visits.map((v) => (
              <div
                key={v.id}
                className="glass rounded-3xl border border-line p-5 space-y-3 bg-surface/60 shadow-xl text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-fg bg-surface-hi px-2 py-0.5 rounded border border-line">
                    {v.order?.orderNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-violet/10 text-violet border-violet/20">
                    {v.status}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-fg block">{v.order?.customerName}</span>
                  <span className="text-muted block mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" /> {v.location}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Schedule Google Meet Modal */}
      <FormModal open={meetModalOpen} title="Schedule Google Meet Session" onClose={() => setMeetModalOpen(false)}>
        <div className="space-y-4 text-xs">
          <Field label="Order ID / Reference" htmlFor="m-oid" required>
            <Input
              id="m-oid"
              value={meetForm.orderId}
              onChange={(e) => setMeetForm({ ...meetForm, orderId: e.target.value })}
              placeholder="Paste Order UUID"
              required
            />
          </Field>

          <Field label="Date & Time" htmlFor="m-time" required>
            <Input
              id="m-time"
              type="datetime-local"
              value={meetForm.scheduledAt}
              onChange={(e) => setMeetForm({ ...meetForm, scheduledAt: e.target.value })}
              required
            />
          </Field>

          <Field label="Custom Google Meet URL (Optional)" htmlFor="m-url">
            <Input
              id="m-url"
              value={meetForm.meetLink}
              onChange={(e) => setMeetForm({ ...meetForm, meetLink: e.target.value })}
              placeholder="https://meet.google.com/..."
            />
          </Field>

          <Field label="Internal Session Notes" htmlFor="m-note">
            <Textarea
              id="m-note"
              rows={2}
              value={meetForm.note}
              onChange={(e) => setMeetForm({ ...meetForm, note: e.target.value })}
              placeholder="Topics to cover, review questions..."
            />
          </Field>

          <Button
            className="w-full h-11 text-sm shadow-lg shadow-violet-500/25"
            variant="primary"
            onClick={handleScheduleMeet}
            disabled={scheduleMeetMutation.isPending || !meetForm.orderId || !meetForm.scheduledAt}
          >
            {scheduleMeetMutation.isPending ? "Scheduling..." : "Confirm & Send Calendar Invitation"}
          </Button>
        </div>
      </FormModal>
    </div>
  );
}
