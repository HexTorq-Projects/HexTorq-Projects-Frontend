import { useState, useEffect } from "react";
import { Settings, Save, Mail, MessageCircle, Clock, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { useAdminSettings, useUpdateSettings, useAdminEmailTemplates } from "@/api/admin";
import type { SystemSettings } from "@/api/types";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Input, Field, Textarea } from "@/components/ui/Input";

export default function AdminSettings() {
  const { data: settingsData, isLoading: isSettingsLoading } = useAdminSettings();
  const { data: templatesData } = useAdminEmailTemplates();
  const updateMutation = useUpdateSettings();

  const [form, setForm] = useState<SystemSettings>({
    referralRewardAmount: 100,
    defaultSlaHours: 24,
    siteContactEmail: "support@hextorq.tech",
    businessWhatsApp: "+919876543210",
    maintenanceMode: false,
    homepageAnnouncement: "",
    googleMeetEnabled: true,
    paymentGateway: "Pay-Panda",
  });

  useEffect(() => {
    if (settingsData) {
      setForm(settingsData);
    }
  }, [settingsData]);

  const handleSave = () => {
    updateMutation.mutate(form);
  };

  if (isSettingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Spinner className="h-8 w-8 text-cyan" />
        <span className="text-xs font-medium text-muted">Loading System Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-fg flex items-center gap-2.5">
            <Settings className="h-6 w-6 text-violet" />
            Enterprise System Configuration & Rules
          </h1>
          <p className="text-xs text-muted">
            Configure site-wide referral rewards, default SLA horizons, contact channels, and email templates.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="gap-1.5 shadow-md shadow-violet-500/20"
        >
          <Save className="h-4 w-4" />
          {updateMutation.isPending ? "Saving..." : "Save System Settings"}
        </Button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Rules Card */}
        <div className="glass rounded-3xl border border-line p-6 space-y-4 bg-surface/60 shadow-xl text-xs">
          <h3 className="font-display font-bold text-base text-fg flex items-center gap-2 pb-2 border-b border-line/60">
            <Sparkles className="h-4 w-4 text-violet" />
            Core Business Rules & SLA
          </h3>

          <Field label="Referral Reward Amount (₹ INR per purchase)" htmlFor="s-ref">
            <Input
              id="s-ref"
              type="number"
              value={form.referralRewardAmount}
              onChange={(e) => setForm({ ...form, referralRewardAmount: Number(e.target.value) })}
            />
          </Field>

          <Field label="Default Fulfillment SLA Deadline (Hours)" htmlFor="s-sla">
            <Input
              id="s-sla"
              type="number"
              value={form.defaultSlaHours}
              onChange={(e) => setForm({ ...form, defaultSlaHours: Number(e.target.value) })}
            />
          </Field>

          <Field label="Official Site Contact Email" htmlFor="s-email">
            <Input
              id="s-email"
              type="email"
              value={form.siteContactEmail}
              onChange={(e) => setForm({ ...form, siteContactEmail: e.target.value })}
            />
          </Field>

          <Field label="Official Support WhatsApp Number" htmlFor="s-wa">
            <Input
              id="s-wa"
              value={form.businessWhatsApp}
              onChange={(e) => setForm({ ...form, businessWhatsApp: e.target.value })}
            />
          </Field>
        </div>

        {/* System & Gateway Status */}
        <div className="glass rounded-3xl border border-line p-6 space-y-4 bg-surface/60 shadow-xl text-xs">
          <h3 className="font-display font-bold text-base text-fg flex items-center gap-2 pb-2 border-b border-line/60">
            <ShieldAlert className="h-4 w-4 text-cyan" />
            Gateway & Mode Configuration
          </h3>

          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
            <span className="text-[11px] font-bold text-emerald-400 block">Active Checkout Gateway: Pay-Panda API</span>
            <p className="text-[11px] text-muted">
              Pay-Panda is configured as the sole verified online checkout gateway.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-2xl border border-line bg-surface-hi/40 cursor-pointer">
              <div>
                <span className="font-bold text-fg block">Google Meet Availability</span>
                <span className="text-[11px] text-muted">Enable 1-on-1 Google Meet sessions across eligible tiers</span>
              </div>
              <input
                type="checkbox"
                checked={form.googleMeetEnabled}
                onChange={(e) => setForm({ ...form, googleMeetEnabled: e.target.checked })}
                className="h-4 w-4 rounded accent-violet cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl border border-line bg-surface-hi/40 cursor-pointer">
              <div>
                <span className="font-bold text-fg block">Maintenance Mode</span>
                <span className="text-[11px] text-muted">Block public checkouts while retaining admin control</span>
              </div>
              <input
                type="checkbox"
                checked={form.maintenanceMode}
                onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                className="h-4 w-4 rounded accent-violet cursor-pointer"
              />
            </label>
          </div>

          <Field label="Homepage Announcement Banner (Empty = Hidden)" htmlFor="s-ann">
            <Input
              id="s-ann"
              value={form.homepageAnnouncement}
              onChange={(e) => setForm({ ...form, homepageAnnouncement: e.target.value })}
              placeholder="e.g. ⚡ Flash Final Year Project Offer: 15% Off All AI Deliverables"
            />
          </Field>
        </div>
      </div>

      {/* Transactional Email Templates Preview */}
      <div className="glass rounded-3xl border border-line p-6 space-y-4 bg-surface/50 shadow-xl text-xs">
        <h3 className="font-display font-bold text-base text-fg flex items-center gap-2 pb-2 border-b border-line/60">
          <Mail className="h-4 w-4 text-violet" />
          System Transactional Email Templates (Enterprise Standard)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(templatesData?.templates ?? []).map((tpl: any) => (
            <div key={tpl.id} className="p-4 rounded-2xl border border-line bg-surface-hi/40 space-y-2">
              <span className="font-bold text-fg block text-xs">{tpl.name}</span>
              <p className="text-[11px] text-cyan font-mono line-clamp-1">{tpl.subject}</p>
              <span className="text-[10px] text-muted block">{tpl.trigger}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
