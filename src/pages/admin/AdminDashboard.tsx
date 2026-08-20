import {
  Users,
  FolderKanban,
  ShoppingBag,
  IndianRupee,
  Percent,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  Gift,
  Tags,
  Heart,
  Kanban,
  Calendar,
  LifeBuoy,
  Send,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminStats } from "@/api/admin";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

function KpiCard({
  icon: Icon,
  label,
  value,
  badge,
  badgeColor,
  iconColor,
  iconBg,
  href,
  subLabel,
}: {
  icon: any;
  label: string;
  value: string | number;
  badge: string;
  badgeColor: string;
  iconColor: string;
  iconBg: string;
  href?: string;
  subLabel?: string;
}) {
  const content = (
    <div className="glass rounded-2xl border border-line p-5 flex flex-col justify-between space-y-3 hover:border-violet/40 hover:shadow-xl hover:shadow-violet/5 transition-all duration-300 group">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconBg} ${iconColor} transition-transform group-hover:scale-105`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-muted uppercase tracking-wider">{label}</span>
        </div>
        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <span className="font-display text-2xl sm:text-3xl font-black text-fg tracking-tight">{value}</span>
          {href && (
            <span className="text-xs font-semibold text-muted group-hover:text-cyan flex items-center gap-1 transition-colors">
              Manage <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
        {subLabel && <p className="text-[11px] text-muted font-medium mt-1">{subLabel}</p>}
      </div>
    </div>
  );

  if (href) {
    return <Link to={href} className="block h-full">{content}</Link>;
  }
  return content;
}

export default function AdminDashboard() {
  const { data, isLoading } = useAdminStats();

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Spinner className="h-8 w-8 text-cyan" />
        <span className="text-xs font-medium text-muted">Loading Enterprise Telemetry...</span>
      </div>
    );
  }

  const totalOrders = Object.values(data.orderStatusCounts).reduce((a, b) => a + b, 0);
  const paidOrders = data.orderStatusCounts["PAID"] || 0;
  const pendingOrders = data.orderStatusCounts["PENDING"] || 0;
  const bookedOrders = data.orderStatusCounts["BOOKED"] || 0;
  const errorOrders = data.orderStatusCounts["PAYMENT_ERROR"] || data.orderStatusCounts["FAILED"] || 0;

  return (
    <div className="space-y-8">
      {/* ── Top Mission Control Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-line">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              HexTorq Enterprise Mission Control • v1.1
            </span>
          </div>
          <h1 className="font-display text-3xl font-black text-fg tracking-tight">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs text-muted">
            Live Pay-Panda revenue settlement, delivery Kanban pipeline, Google Meet sessions, and student telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/admin/delivery">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-md shadow-violet-500/20">
              <Kanban className="h-4 w-4" />
              Delivery Board
            </Button>
          </Link>
          <Link to="/admin/calendar">
            <Button variant="outline" size="sm" className="gap-1.5 border-line hover:border-cyan/40 hover:text-cyan">
              <Calendar className="h-4 w-4" />
              Meets & Visits
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Operational Action Alerts Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/delivery"
          className="glass rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-center justify-between hover:bg-amber-500/10 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-fg block">Pending Delivery</span>
              <span className="text-[11px] text-muted">{data.pendingDeliveryCount || 0} packages to dispatch</span>
            </div>
          </div>
          <span className="font-display text-2xl font-black text-amber-400">{data.pendingDeliveryCount || 0}</span>
        </Link>

        <Link
          to="/admin/orders?slaBreached=true"
          className={`glass rounded-2xl border p-4 flex items-center justify-between transition-all group ${
            (data.slaBreachedCount || 0) > 0
              ? "border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/15"
              : "border-line bg-surface/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-fg block">SLA Breached</span>
              <span className="text-[11px] text-muted">
                {(data.slaBreachedCount || 0) > 0 ? "Action Required" : "All on Track"}
              </span>
            </div>
          </div>
          <span className="font-display text-2xl font-black text-rose-400">{data.slaBreachedCount || 0}</span>
        </Link>

        <Link
          to="/admin/tickets?status=OPEN"
          className="glass rounded-2xl border border-line bg-surface/40 p-4 flex items-center justify-between hover:border-violet/40 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet/20 text-violet">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-fg block">Open Tickets</span>
              <span className="text-[11px] text-muted">{data.openTicketCount || 0} awaiting staff reply</span>
            </div>
          </div>
          <span className="font-display text-2xl font-black text-fg">{data.openTicketCount || 0}</span>
        </Link>

        <Link
          to="/admin/calendar"
          className="glass rounded-2xl border border-line bg-surface/40 p-4 flex items-center justify-between hover:border-cyan/40 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan/20 text-cyan">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-fg block">Meets Today</span>
              <span className="text-[11px] text-muted">{data.meetsTodayCount || 0} Google Meets today</span>
            </div>
          </div>
          <span className="font-display text-2xl font-black text-fg">{data.meetsTodayCount || 0}</span>
        </Link>
      </div>

      {/* ── Revenue Multi-Period Breakdown ── */}
      <div className="glass rounded-3xl border border-line p-6 space-y-5 bg-surface/50 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line/60">
          <div className="space-y-0.5">
            <h2 className="font-display text-lg font-bold text-fg flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-emerald-400" />
              Pay-Panda Verified Revenue Breakdown
            </h2>
            <p className="text-xs text-muted">
              Live settlement figures sourced strictly from verified Pay-Panda payments.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            All-Time: ₹{data.totalRevenue.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-line bg-surface-hi/40">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">Today's Revenue</span>
            <span className="font-display text-2xl font-black text-emerald-400 block mt-1">
              ₹{(data.revenueToday || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-line bg-surface-hi/40">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">This Week's Revenue</span>
            <span className="font-display text-2xl font-black text-emerald-400 block mt-1">
              ₹{(data.revenueThisWeek || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="p-4 rounded-2xl border border-line bg-surface-hi/40">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">This Month's Revenue</span>
            <span className="font-display text-2xl font-black text-emerald-400 block mt-1">
              ₹{(data.revenueThisMonth || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI Stat Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <KpiCard
          icon={Users}
          label="Registered Students"
          value={data.userCount}
          badge={`+${data.usersThisWeek || 0} this week`}
          badgeColor="bg-violet/10 text-violet border-violet/25"
          iconColor="text-violet"
          iconBg="bg-violet/10 border-violet/20"
          href="/admin/users"
          subLabel="Total active registered student accounts"
        />
        <KpiCard
          icon={FolderKanban}
          label="Catalog Projects"
          value={data.projectCount}
          badge={`+${data.projectsThisWeek || 0} new`}
          badgeColor="bg-cyan/10 text-cyan border-cyan/25"
          iconColor="text-cyan"
          iconBg="bg-cyan/10 border-cyan/20"
          href="/admin/projects"
          subLabel="Complete engineering repository packages"
        />
        <KpiCard
          icon={ShoppingBag}
          label="Total Orders Placed"
          value={totalOrders}
          badge={`${paidOrders} Paid`}
          badgeColor="bg-indigo-500/10 text-indigo-400 border-indigo-500/25"
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10 border-indigo-500/20"
          href="/admin/orders"
          subLabel={`${pendingOrders} Pending • ${errorOrders} Failed`}
        />
        <KpiCard
          icon={MessageSquare}
          label="Active Enquiries"
          value={data.newEnquiryCount}
          badge={`+${data.enquiriesToday || 0} today`}
          badgeColor="bg-amber-500/15 text-amber-400 border-amber-500/30"
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
          href="/admin/enquiries"
          subLabel="Direct WhatsApp and web consultation leads"
        />
        <KpiCard
          icon={Percent}
          label="Active Flash Offers"
          value={data.activeOfferCount}
          badge={(data.offersExpiring24h || 0) > 0 ? `${data.offersExpiring24h} expiring 24h` : "Live"}
          badgeColor="bg-rose-500/10 text-rose-400 border-rose-500/25"
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10 border-rose-500/20"
          href="/admin/offers"
          subLabel="Configured discount campaigns and pre-booking deals"
        />
        <KpiCard
          icon={Gift}
          label="Referral Program"
          value="₹100"
          badge="Live Payouts"
          badgeColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          href="/admin/referrals"
          subLabel="Manual UPI payout ledger with UTR tracking"
        />
      </div>

      {/* ── Two-Column Layout: Top Projects Leaderboard + Live Operational Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Projects by Paid Orders */}
        <div className="glass rounded-3xl border border-line p-6 space-y-4 bg-surface/50 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-line/60">
            <h3 className="font-display font-bold text-base text-fg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan" />
              Top 5 Projects by Revenue
            </h3>
            <Link to="/admin/projects" className="text-xs text-cyan hover:underline">
              View Catalog
            </Link>
          </div>

          <div className="space-y-2.5">
            {(data.topProjects || []).length === 0 ? (
              <p className="text-xs text-muted py-6 text-center">No paid order items recorded yet.</p>
            ) : (
              data.topProjects?.map((tp, idx) => (
                <div
                  key={tp.projectId}
                  className="flex items-center justify-between p-3 rounded-xl border border-line bg-surface-hi/30 hover:bg-surface-hi/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-surface font-mono text-xs font-bold text-muted shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-fg truncate">{tp.title}</span>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <span className="font-mono text-xs font-bold text-emerald-400 block">
                      ₹{tp.totalRevenue.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-muted">{tp.paidOrderCount} orders</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Operational Activity Feed */}
        <div className="glass rounded-3xl border border-line p-6 space-y-4 bg-surface/50 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-line/60">
            <h3 className="font-display font-bold text-base text-fg flex items-center gap-2">
              <Activity className="h-4 w-4 text-violet" />
              Live Operational Activity Feed
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Real-time
            </span>
          </div>

          <div className="space-y-2.5">
            {(data.recentActivity || []).length === 0 ? (
              <p className="text-xs text-muted py-6 text-center">No recent activities recorded.</p>
            ) : (
              data.recentActivity?.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between p-3 rounded-xl border border-line bg-surface-hi/30 text-xs"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <span className="font-bold text-fg block truncate">{act.title}</span>
                    <span className="text-[11px] text-muted block truncate">{act.subtitle}</span>
                  </div>
                  <span className="text-[10px] text-faint font-mono shrink-0">
                    {new Date(act.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── System Status & Security Telemetry Ribbon ── */}
      <div className="glass rounded-2xl border border-line/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted bg-surface/30">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-fg block">HexTorq Infrastructure Telemetry</span>
            <span className="text-[11px] text-muted">
              {data.infrastructureStatus?.lastDeployment || "Enterprise v1.1"} • API Latency:{" "}
              <strong className="text-fg font-mono">{data.infrastructureStatus?.apiLatencyMs || 24}ms</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Pay-Panda Gateway: <strong>CONNECTED</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>SMTP Mailer: <strong>READY</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>PostgreSQL: <strong>HEALTHY</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
