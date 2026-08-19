import { useState, useEffect } from "react";
import {
  Gift,
  Users,
  Wallet,
  CheckCircle,
  XCircle,
  ExternalLink,
  IndianRupee,
  AlertTriangle,
  ArrowUpRight,
  X,
  CreditCard,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  Search,
} from "lucide-react";
import {
  useAdminReferralStats,
  useAdminReferralEarnings,
  useUpdateAdminReferralEarning,
  useAdminReferralWithdrawals,
  useUpdateAdminReferralWithdrawal,
  useAdminReferrers,
} from "@/api/admin";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";

export default function AdminReferrals() {
  const [tab, setTab] = useState<"withdrawals" | "earnings" | "referrers">("withdrawals");
  const [earningsPage, setEarningsPage] = useState(1);
  const [withdrawalsPage, setWithdrawalsPage] = useState(1);
  const [referrersPage, setReferrersPage] = useState(1);
  const [earningsFilter, setEarningsFilter] = useState("");
  const [withdrawalsFilter, setWithdrawalsFilter] = useState("");

  const { data: stats } = useAdminReferralStats();
  const { data: earningsData } = useAdminReferralEarnings(earningsPage, earningsFilter || undefined);
  const { data: withdrawalsData } = useAdminReferralWithdrawals(withdrawalsPage, withdrawalsFilter || undefined);
  const { data: referrersData } = useAdminReferrers(referrersPage);
  const updateEarning = useUpdateAdminReferralEarning();
  const updateWithdrawal = useUpdateAdminReferralWithdrawal();

  // Selected withdrawal modal for payment processing
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any | null>(null);

  const pendingWithdrawals = withdrawalsData?.items.filter((w) => w.status === "PENDING") || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fg flex items-center gap-2.5 font-display">
          <Gift className="h-6 w-6 text-emerald-400" />
          Referral & Payouts Management
        </h1>
      </div>

      {/* ── 1. Top Stats Cards (Clean 4-Column Responsive Grid, No Truncation) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {[
          {
            label: "Total Referral Codes",
            value: stats?.totalCodes ?? 0,
            icon: <Users className="h-4.5 w-4.5 text-violet" />,
            badge: "Active",
            badgeColor: "bg-violet/10 text-violet border-violet/20",
          },
          {
            label: "Total Friend Signups",
            value: stats?.referredUsers ?? 0,
            icon: <ArrowUpRight className="h-4.5 w-4.5 text-cyan" />,
            badge: "Signups",
            badgeColor: "bg-cyan/10 text-cyan border-cyan/20",
          },
          {
            label: "Total Rewards Given",
            value: stats?.totalEarnings ?? 0,
            icon: <Gift className="h-4.5 w-4.5 text-emerald-400" />,
            badge: "Purchases",
            badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          },
          {
            label: "Pending Action Requests",
            value: stats?.pendingWithdrawals ?? 0,
            icon: <AlertTriangle className="h-4.5 w-4.5 text-amber-400" />,
            badge: stats?.pendingWithdrawals ? "Action Req" : "Clear",
            badgeColor: stats?.pendingWithdrawals
              ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
              : "bg-surface text-muted border-line",
          },
          {
            label: "Pending ₹ Amount",
            value: `₹${stats?.pendingAmount ?? 0}`,
            icon: <Clock className="h-4.5 w-4.5 text-amber-400" />,
            badge: "Pending",
            badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          },
          {
            label: "Confirmed ₹ Amount",
            value: `₹${stats?.confirmedAmount ?? 0}`,
            icon: <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />,
            badge: "Confirmed",
            badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          },
          {
            label: "Total Paid Out ₹",
            value: `₹${stats?.totalWithdrawn ?? 0}`,
            icon: <IndianRupee className="h-4.5 w-4.5 text-cyan" />,
            badge: "Paid via UPI",
            badgeColor: "bg-cyan/10 text-cyan border-cyan/20",
          },
          {
            label: "Pending Withdraw ₹",
            value: `₹${stats?.pendingWithdrawalAmount ?? 0}`,
            icon: <Wallet className="h-4.5 w-4.5 text-amber-400" />,
            badge: "Needs Payout",
            badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="glass border border-line rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:border-line/80 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-surface-hi border border-line shrink-0">
                  {s.icon}
                </div>
                <span className="text-xs font-semibold text-muted leading-snug">
                  {s.label}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${s.badgeColor}`}
              >
                {s.badge}
              </span>
            </div>
            <div className="font-display text-xl sm:text-2xl font-black text-fg pl-0.5">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── System Overview Guide ── */}
      <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-4 sm:p-5 text-xs sm:text-sm text-muted space-y-2.5">
        <h3 className="font-bold text-fg flex items-center gap-2">
          <ShieldCheck className="h-4.5 w-4.5 text-cyan" />
          How the Referral & Payout System Works
        </h3>
        <ul className="list-disc list-inside space-y-1.5 text-xs text-muted/90">
          <li>
            Every user gets a unique referral link. When a friend signs up through it and pays for any project
            (verified via Pay-Panda), the referrer earns <strong className="text-fg">₹100 automatically</strong> in their wallet.
          </li>
          <li>
            Rewards are <strong className="text-fg">credited to the referrer's wallet instantly</strong> with status <strong className="text-emerald-400">CONFIRMED</strong>.
          </li>
          <li>
            Minimum withdrawal is <strong className="text-fg">₹100</strong> via UPI. Payout is manual: transfer the
            amount to the user's UPI ID, then enter the transaction/reference ID to mark it <strong className="text-emerald-400">PAID</strong> — the student receives a confirmation email and the dashboard updates in real-time.
          </li>
          <li>
            Statuses — Rewards: <strong className="text-emerald-400">CONFIRMED</strong> / <strong className="text-rose-400">CANCELLED</strong>. Withdrawals:{" "}
            <strong className="text-amber-400">PENDING (needs action)</strong> → <strong className="text-emerald-400">PAID</strong> / <strong className="text-rose-400">REJECTED</strong>.
          </li>
        </ul>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-1.5 rounded-2xl border border-line bg-surface/50 p-1.5 w-fit flex-wrap">
        {[
          {
            key: "withdrawals" as const,
            label: `Withdrawal Requests ${pendingWithdrawals.length > 0 ? `(${pendingWithdrawals.length} Action Needed)` : ""}`,
            icon: <ExternalLink className="h-4 w-4" />,
            highlight: pendingWithdrawals.length > 0,
          },
          { key: "earnings" as const, label: "Referral Rewards", icon: <Wallet className="h-4 w-4" /> },
          { key: "referrers" as const, label: "Referrers Performance", icon: <Users className="h-4 w-4" /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              tab === t.key
                ? "bg-violet text-white shadow-md shadow-violet/20"
                : t.highlight
                ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                : "text-muted hover:text-fg hover:bg-surface-hi"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 2. Tab: Withdrawal Requests (Formatted, Clean Columns, No UUID Noise) ── */}
      {tab === "withdrawals" && (
        <div className="space-y-4">
          {/* Action Required Banner if pending */}
          {pendingWithdrawals.length > 0 && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-fg">
                    {pendingWithdrawals.length} Withdrawal Request{pendingWithdrawals.length !== 1 ? "s" : ""} Pending Processing
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Transfer the requested amount to the student's UPI ID, then click <strong>Process</strong> to record the Transaction ID and notify the user.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 items-center justify-between">
            <div className="flex gap-3 items-center">
              <select
                value={withdrawalsFilter}
                onChange={(e) => {
                  setWithdrawalsFilter(e.target.value);
                  setWithdrawalsPage(1);
                }}
                className="bg-surface border border-line rounded-xl px-3.5 py-2 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending (Needs Action)</option>
                <option value="APPROVED">Paid / Approved</option>
                <option value="PAID">Paid</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="glass border border-line rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="border-b border-line bg-surface/75 text-left text-muted text-xs">
                  <th className="px-4 py-3.5 font-semibold">Student / User</th>
                  <th className="px-4 py-3.5 font-semibold">Amount</th>
                  <th className="px-4 py-3.5 font-semibold">UPI Payment Details</th>
                  <th className="px-4 py-3.5 font-semibold">Request Date</th>
                  <th className="px-4 py-3.5 font-semibold">Status & Note</th>
                  <th className="px-4 py-3.5 font-semibold">Transaction ID</th>
                  <th className="px-4 py-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalsData?.items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-xs text-muted">
                      No withdrawal requests found.
                    </td>
                  </tr>
                )}
                {withdrawalsData?.items.map((w) => {
                  const isPaid = w.status === "APPROVED" || w.status === "PAID";
                  const isPending = w.status === "PENDING";
                  return (
                    <tr
                      key={w.id}
                      className="border-b border-line/50 last:border-0 hover:bg-surface/30 transition-colors"
                    >
                      {/* 1. Student Name & Email */}
                      <td className="px-4 py-3.5">
                        <div className="text-xs font-bold text-fg">{w.userName}</div>
                        <div className="text-[11px] text-muted font-mono">{w.userEmail}</div>
                      </td>

                      {/* 2. Amount */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                          ₹{w.amount}
                        </span>
                      </td>

                      {/* 3. UPI Details with 1-click copy */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <code className="text-xs font-mono font-bold text-cyan">{w.upiId}</code>
                          <button
                            onClick={() => navigator.clipboard.writeText(w.upiId)}
                            className="text-muted hover:text-emerald-400 p-0.5 transition-colors"
                            title="Copy UPI ID"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-[11px] text-muted">Holder: <strong className="text-fg">{w.upiHolderName}</strong></div>
                      </td>

                      {/* 4. Request Date */}
                      <td className="px-4 py-3.5 text-xs text-muted whitespace-nowrap">
                        {new Date(w.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* 5. Status Badge & Note */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isPending
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : isPaid
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {isPaid ? "PAID" : w.status}
                        </span>
                        {w.adminNote && (
                          <div className="text-[10px] text-muted italic mt-1 max-w-[170px] truncate" title={w.adminNote}>
                            Note: {w.adminNote}
                          </div>
                        )}
                      </td>

                      {/* 6. Transaction Reference ID */}
                      <td className="px-4 py-3.5 text-xs font-mono">
                        {w.transactionId ? (
                          <span className="text-cyan font-semibold bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded-md">
                            {w.transactionId}
                          </span>
                        ) : (
                          <span className="text-muted text-[11px]">—</span>
                        )}
                      </td>

                      {/* 7. Action Button */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {isPending ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setSelectedWithdrawal(w)}
                            className="text-xs h-8 px-3.5 gap-1.5 shadow-md shadow-violet-500/20"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            Process Payout
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedWithdrawal(w)}
                            className="text-xs h-8 px-3 text-muted hover:text-fg border-line hover:border-violet/40"
                          >
                            View Details
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {withdrawalsData && withdrawalsData.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              {Array.from({ length: withdrawalsData.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setWithdrawalsPage(p)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                    p === withdrawalsPage ? "bg-violet text-white border-violet" : "border-line text-muted hover:text-fg"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Referral Rewards ── */}
      {tab === "earnings" && (
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <select
              value={earningsFilter}
              onChange={(e) => {
                setEarningsFilter(e.target.value);
                setEarningsPage(1);
              }}
              className="bg-surface border border-line rounded-xl px-3.5 py-2 text-xs text-fg cursor-pointer focus:outline-none focus:border-violet"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="glass border border-line rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-line bg-surface/75 text-left text-muted text-xs">
                  <th className="px-4 py-3.5 font-semibold">Referrer (Earned By)</th>
                  <th className="px-4 py-3.5 font-semibold">Referred Friend</th>
                  <th className="px-4 py-3.5 font-semibold">Project Purchased</th>
                  <th className="px-4 py-3.5 font-semibold">Reward</th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                  <th className="px-4 py-3.5 font-semibold">Date</th>
                  <th className="px-4 py-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {earningsData?.items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-xs text-muted">
                      No referral rewards found.
                    </td>
                  </tr>
                )}
                {earningsData?.items.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-line/50 last:border-0 hover:bg-surface/30 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="text-fg text-xs font-bold">{e.referrerName}</div>
                      <div className="text-[11px] text-muted font-mono">{e.referrerEmail}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-fg text-xs font-semibold">{e.referredName}</div>
                      <div className="text-[11px] text-muted font-mono">{e.referredEmail}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-fg max-w-[220px] truncate" title={e.projectTitle}>
                      {e.projectTitle}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        ₹{e.amount}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          e.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : e.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted whitespace-nowrap">
                      {new Date(e.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {e.status === "PENDING" && (
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => updateEarning.mutate({ id: e.id, status: "CONFIRMED" })}
                            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateEarning.mutate({ id: e.id, status: "CANCELLED" })}
                            className="text-xs font-bold text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/30 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {earningsData && earningsData.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              {Array.from({ length: earningsData.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setEarningsPage(p)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                    p === earningsPage ? "bg-violet text-white border-violet" : "border-line text-muted hover:text-fg"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Referrers Performance ── */}
      {tab === "referrers" && (
        <div className="space-y-4">
          <div className="glass border border-line rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="border-b border-line bg-surface/75 text-left text-muted text-xs">
                  <th className="px-4 py-3.5 font-semibold">Referrer</th>
                  <th className="px-4 py-3.5 font-semibold">Referral Code</th>
                  <th className="px-4 py-3.5 font-semibold">Joined Date</th>
                  <th className="px-4 py-3.5 font-semibold">Total Signups</th>
                  <th className="px-4 py-3.5 font-semibold">Purchases</th>
                  <th className="px-4 py-3.5 font-semibold">Pending ₹</th>
                  <th className="px-4 py-3.5 font-semibold">Confirmed ₹</th>
                  <th className="px-4 py-3.5 font-semibold">Withdrawn ₹</th>
                  <th className="px-4 py-3.5 font-semibold text-right">Available Wallet ₹</th>
                </tr>
              </thead>
              <tbody>
                {referrersData?.items.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-xs text-muted">
                      No referral codes created yet.
                    </td>
                  </tr>
                )}
                {referrersData?.items.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-line/50 last:border-0 hover:bg-surface/30 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="text-fg text-xs font-bold">{r.referrerName}</div>
                      <div className="text-[11px] text-muted font-mono">{r.referrerEmail}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <code className="text-xs font-mono font-bold text-cyan bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded-md">
                        {r.code}
                      </code>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted whitespace-nowrap">
                      {new Date(r.joinedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-bold text-fg">{r.referrals}</td>
                    <td className="px-4 py-3.5 text-xs font-bold text-fg">{r.purchases}</td>
                    <td className="px-4 py-3.5 text-xs font-mono text-amber-400 font-semibold">₹{r.pending}</td>
                    <td className="px-4 py-3.5 text-xs font-mono text-emerald-400 font-semibold">₹{r.confirmed}</td>
                    <td className="px-4 py-3.5 text-xs font-mono text-muted">₹{r.withdrawn}</td>
                    <td className="px-4 py-3.5 text-right text-xs font-mono font-black text-fg">
                      <span className="bg-surface-hi border border-line px-2.5 py-1 rounded-lg">
                        ₹{r.available}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {referrersData && referrersData.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              {Array.from({ length: referrersData.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setReferrersPage(p)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                    p === referrersPage ? "bg-violet text-white border-violet" : "border-line text-muted hover:text-fg"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 4. Process Payment & Details Modal (Scroll Containment & Body Locking Fixed) ── */}
      {selectedWithdrawal && (
        <ProcessWithdrawalModal
          withdrawal={selectedWithdrawal}
          onClose={() => setSelectedWithdrawal(null)}
          onUpdate={updateWithdrawal.mutate}
          isPending={updateWithdrawal.isPending}
        />
      )}
    </div>
  );
}

/**
 * Clean, scroll-locked modal for processing payouts.
 * Uses body scroll locking, outer overflow-y containment, and clean scrollable form body.
 */
function ProcessWithdrawalModal({
  withdrawal,
  onClose,
  onUpdate,
  isPending,
}: {
  withdrawal: any;
  onClose: () => void;
  onUpdate: (args: { id: string; status: string; transactionId?: string; adminNote?: string }) => void;
  isPending?: boolean;
}) {
  const [transactionId, setTransactionId] = useState(withdrawal.transactionId || "");
  const [adminNote, setAdminNote] = useState(withdrawal.adminNote || "");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [rejectMode, setRejectMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isPendingStatus = withdrawal.status === "PENDING";
  const isPaid = withdrawal.status === "APPROVED" || withdrawal.status === "PAID";

  // Lock body scroll when modal is open and clean up on unmount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(withdrawal.upiId).then(() => {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    });
  };

  const handleConfirmPaid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setErrorMsg("Please enter the payment transaction/reference ID before confirming.");
      return;
    }
    setErrorMsg("");
    onUpdate({
      id: withdrawal.id,
      status: "PAID",
      transactionId: transactionId.trim(),
      adminNote: adminNote.trim() || undefined,
    });
    onClose();
  };

  const handleReject = () => {
    onUpdate({
      id: withdrawal.id,
      status: "REJECTED",
      adminNote: adminNote.trim() || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-6 flex min-h-full items-center justify-center overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-2xl space-y-4 max-h-[88vh] flex flex-col my-auto overscroll-contain">
        {/* Sticky Header */}
        <div className="flex items-center justify-between pb-3 border-b border-line shrink-0">
          <h3 className="font-display font-bold text-lg text-fg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-400" />
            Withdrawal Request Details
          </h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-fg transition-colors p-1 rounded-lg hover:bg-surface-hi cursor-pointer"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1 overscroll-contain">
          {/* Amount Banner */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Amount to Transfer
            </span>
            <div className="font-display text-3xl font-black text-fg mt-1">
              ₹{withdrawal.amount}
            </div>
          </div>

          {/* User & UPI Details Card */}
          <div className="space-y-2.5 bg-surface-hi/50 rounded-2xl border border-line p-4 text-xs">
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-muted">User Name:</span>
              <span className="font-bold text-fg">{withdrawal.userName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-muted">User Email:</span>
              <span className="font-mono font-medium text-fg">{withdrawal.userEmail}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-muted">UPI Holder Name:</span>
              <span className="font-semibold text-fg">{withdrawal.upiHolderName}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted font-medium">UPI ID:</span>
              <div className="flex items-center gap-2">
                <code className="font-mono font-bold text-cyan text-sm bg-cyan/10 border border-cyan/25 px-2 py-0.5 rounded-md">
                  {withdrawal.upiId}
                </code>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-emerald-400 transition-colors p-1 border border-line rounded-lg hover:border-emerald-400/40 cursor-pointer"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {isPendingStatus ? (
            <div className="space-y-4">
              {/* Payment Instructions */}
              <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-3.5 text-xs text-muted space-y-1.5">
                <p className="font-bold text-fg flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-cyan" />
                  Manual Payment Steps:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-muted">
                  <li>
                    Open GPay / PhonePe / Paytm / Bank app.
                  </li>
                  <li>
                    Transfer <strong>₹{withdrawal.amount}</strong> to <strong>{withdrawal.upiId}</strong> ({withdrawal.upiHolderName}).
                  </li>
                  <li>
                    Paste the Transaction / UTR / Reference ID below and submit.
                  </li>
                </ol>
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400">
                  {errorMsg}
                </div>
              )}

              {!rejectMode ? (
                <form onSubmit={handleConfirmPaid} className="space-y-4">
                  <Field
                    label="Payment Transaction / Reference ID (UTR)"
                    hint="Required to verify payout and notify the student"
                  >
                    <Input
                      value={transactionId}
                      onChange={(e) => {
                        setTransactionId(e.target.value);
                        if (errorMsg) setErrorMsg("");
                      }}
                      placeholder="e.g. 423456789012 or UPI/2026/..."
                      className="font-mono text-sm"
                      required
                      autoFocus
                    />
                  </Field>

                  <Field label="Admin Note (Optional)">
                    <Input
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="e.g. Paid via GPay / Payout completed"
                    />
                  </Field>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isPending || !transactionId.trim()}
                      className="flex-1 gap-2 shadow-lg shadow-violet-500/25"
                    >
                      <Check className="h-4 w-4" />
                      {isPending ? "Confirming..." : "Confirm Payment & Mark Paid"}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setRejectMode(true)}
                      className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                    >
                      Reject
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <Field label="Rejection Reason" hint="Will be emailed to the student">
                    <Input
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="e.g. Invalid UPI ID / Name mismatch, please re-submit"
                      required
                    />
                  </Field>
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="solid"
                      onClick={handleReject}
                      disabled={isPending}
                      className="flex-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 font-bold"
                    >
                      Confirm Rejection
                    </Button>
                    <Button variant="outline" onClick={() => setRejectMode(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-line/40">
                <span className="text-muted">Payout Status:</span>
                <span className={`font-bold ${isPaid ? "text-emerald-400" : "text-rose-400"}`}>
                  {isPaid ? "PAID" : withdrawal.status}
                </span>
              </div>
              {withdrawal.transactionId && (
                <div className="flex justify-between py-1.5 border-b border-line/40">
                  <span className="text-muted">Transaction ID:</span>
                  <span className="font-mono font-bold text-cyan bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded">
                    {withdrawal.transactionId}
                  </span>
                </div>
              )}
              {withdrawal.paidAt && (
                <div className="flex justify-between py-1.5 border-b border-line/40">
                  <span className="text-muted">Paid Date / Time:</span>
                  <span className="text-fg font-medium">
                    {new Date(withdrawal.paidAt).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              {withdrawal.adminNote && (
                <div className="flex justify-between py-1.5">
                  <span className="text-muted">Admin Note:</span>
                  <span className="text-fg italic">{withdrawal.adminNote}</span>
                </div>
              )}
              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
