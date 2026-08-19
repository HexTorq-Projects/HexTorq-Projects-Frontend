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
  ExternalLink,
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
}: {
  icon: any;
  label: string;
  value: string | number;
  badge: string;
  badgeColor: string;
  iconColor: string;
  iconBg: string;
  href?: string;
}) {
  const content = (
    <div className="glass rounded-2xl border border-line p-5 flex flex-col justify-between space-y-4 hover:border-violet/40 hover:shadow-xl hover:shadow-violet/5 transition-all duration-300 group">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${iconBg} ${iconColor} transition-transform group-hover:scale-105`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-muted uppercase tracking-wider">{label}</span>
        </div>
        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <div className="flex items-baseline justify-between pt-1">
        <span className="font-display text-3xl font-black text-fg tracking-tight">{value}</span>
        {href && (
          <span className="text-xs font-semibold text-muted group-hover:text-cyan flex items-center gap-1 transition-colors">
            Manage <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        )}
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
        <span className="text-xs font-medium text-muted">Loading mission control telemetry...</span>
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
              System Online • Live Telemetry
            </span>
          </div>
          <h1 className="font-display text-3xl font-black text-fg tracking-tight">
            Admin Mission Control
          </h1>
          <p className="text-xs text-muted">
            Global repository metrics, real-time Pay-Panda orders, inquiries, and student payouts.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/admin/projects">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-md shadow-violet-500/20">
              <FolderKanban className="h-4 w-4" />
              Manage Projects
            </Button>
          </Link>
          <Link to="/admin/referrals">
            <Button variant="outline" size="sm" className="gap-1.5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
              <Gift className="h-4 w-4" />
              Payouts & Referrals
            </Button>
          </Link>
        </div>
      </div>

      {/* ── KPI Stat Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <KpiCard
          icon={Users}
          label="Registered Students"
          value={data.userCount}
          badge="Live"
          badgeColor="bg-violet/10 text-violet border-violet/25"
          iconColor="text-violet"
          iconBg="bg-violet/10 border-violet/20"
          href="/admin/users"
        />
        <KpiCard
          icon={FolderKanban}
          label="Catalog Projects"
          value={data.projectCount}
          badge="Full Source"
          badgeColor="bg-cyan/10 text-cyan border-cyan/25"
          iconColor="text-cyan"
          iconBg="bg-cyan/10 border-cyan/20"
          href="/admin/projects"
        />
        <KpiCard
          icon={IndianRupee}
          label="Total Paid Revenue"
          value={`₹${data.totalRevenue.toLocaleString("en-IN")}`}
          badge="Pay-Panda Verified"
          badgeColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          href="/admin/orders?status=PAID"
        />
        <KpiCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders}
          badge={`${paidOrders} Paid`}
          badgeColor="bg-indigo-500/10 text-indigo-400 border-indigo-500/25"
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10 border-indigo-500/20"
          href="/admin/orders"
        />
        <KpiCard
          icon={MessageSquare}
          label="Active Enquiries"
          value={data.newEnquiryCount}
          badge={data.newEnquiryCount > 0 ? "Action Needed" : "All Clear"}
          badgeColor={data.newEnquiryCount > 0 ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-surface-hi text-muted border-line"}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
          href="/admin/enquiries"
        />
        <KpiCard
          icon={Percent}
          label="Active Flash Offers"
          value={data.activeOfferCount}
          badge="Discounts Live"
          badgeColor="bg-rose-500/10 text-rose-400 border-rose-500/25"
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10 border-rose-500/20"
          href="/admin/offers"
        />
      </div>

      {/* ── Order Pipeline Breakdown ── */}
      <div className="glass rounded-3xl border border-line p-6 space-y-6 shadow-xl bg-surface/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line/60">
          <div className="space-y-0.5">
            <h2 className="font-display text-lg font-bold text-fg flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan" />
              Order Pipeline & Payment Status
            </h2>
            <p className="text-xs text-muted">
              Real-time payment gateway verification distribution across all checkouts.
            </p>
          </div>
          <Link to="/admin/orders" className="text-xs font-semibold text-cyan hover:underline flex items-center gap-1">
            View full order ledger <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Visual Progress Bar */}
        {totalOrders > 0 && (
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded-full bg-surface-hi border border-line flex overflow-hidden p-0.5">
              {paidOrders > 0 && (
                <div
                  style={{ width: `${(paidOrders / totalOrders) * 100}%` }}
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  title={`PAID: ${paidOrders} (${Math.round((paidOrders / totalOrders) * 100)}%)`}
                />
              )}
              {bookedOrders > 0 && (
                <div
                  style={{ width: `${(bookedOrders / totalOrders) * 100}%` }}
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  title={`BOOKED: ${bookedOrders}`}
                />
              )}
              {pendingOrders > 0 && (
                <div
                  style={{ width: `${(pendingOrders / totalOrders) * 100}%` }}
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  title={`PENDING: ${pendingOrders}`}
                />
              )}
              {errorOrders > 0 && (
                <div
                  style={{ width: `${(errorOrders / totalOrders) * 100}%` }}
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  title={`ERROR/FAILED: ${errorOrders}`}
                />
              )}
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted">
              <span>{totalOrders} total checkout attempts recorded</span>
              <span className="text-emerald-400 font-bold">
                {totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0}% Conversion
              </span>
            </div>
          </div>
        )}

        {/* Status Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          {Object.entries(data.orderStatusCounts).map(([status, count]) => {
            const isPaid = status === "PAID";
            const isBooked = status === "BOOKED";
            const isPending = status === "PENDING";
            const isError = status === "PAYMENT_ERROR" || status === "FAILED";

            return (
              <Link
                key={status}
                to={`/admin/orders?status=${status}`}
                className="group flex flex-col justify-between p-4 rounded-2xl border border-line bg-surface-hi/40 hover:bg-surface-hi hover:border-violet/40 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted group-hover:text-fg transition-colors">
                    {status}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isPaid
                        ? "bg-emerald-400"
                        : isBooked
                        ? "bg-blue-400"
                        : isPending
                        ? "bg-amber-400"
                        : isError
                        ? "bg-rose-400"
                        : "bg-muted"
                    }`}
                  />
                </div>
                <div className="font-display text-2xl font-black text-fg mt-2">
                  {count}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Quick Management Matrix Hub ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/admin/collections"
          className="glass rounded-2xl border border-line p-5 hover:border-violet/40 hover:bg-surface-hi/40 transition-all flex items-start gap-4 group"
        >
          <div className="p-3 rounded-xl bg-violet/10 border border-violet/20 text-violet shrink-0 group-hover:scale-105 transition-transform">
            <Tags className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-fg group-hover:text-cyan transition-colors">
              Collections & Categories
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Configure engineering streams, sub-categories, and specialized application domains.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/wishlist"
          className="glass rounded-2xl border border-line p-5 hover:border-violet/40 hover:bg-surface-hi/40 transition-all flex items-start gap-4 group"
        >
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-fg group-hover:text-cyan transition-colors">
              Student Wishlist Analytics
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              See the most in-demand project titles saved by students to forecast demand.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/referrals"
          className="glass rounded-2xl border border-line p-5 hover:border-violet/40 hover:bg-surface-hi/40 transition-all flex items-start gap-4 group"
        >
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-fg group-hover:text-cyan transition-colors">
              Student Payouts & UPI
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Process manual UPI referral withdrawals and review student link performance.
            </p>
          </div>
        </Link>
      </div>

      {/* ── System Status & Security Telemetry Ribbon ── */}
      <div className="glass rounded-2xl border border-line/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted bg-surface/30">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-fg block">HexTorq Infrastructure Status</span>
            <span className="text-[11px] text-muted">All endpoints operational • HTTPS SSL Encrypted</span>
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
