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

  // Lock background scroll while the withdrawal modal is open
  useEffect(() => {
    if (selectedWithdrawal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selectedWithdrawal]);

  const pendingWithdrawals = withdrawalsData?.items.filter((w) => w.status === "PENDING") || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fg flex items-center gap-2 font-display">
          <Gift className="h-6 w-6 text-emerald-400" />
          Referral & Payouts Management
        </h1>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 md:gap-4">
        {[
          { label: "Total Codes", value: stats?.totalCodes ?? 0, icon: <Users className="h-4 w-4 text-violet" /> },
          { label: "Referrals (Signups)", value: stats?.referredUsers ?? 0, icon: <ArrowUpRight className="h-4 w-4 text-cyan" /> },
          { label: "Rewards Given", value: stats?.totalEarnings ?? 0, icon: <Gift className="h-4 w-4 text-cyan" /> },
          { label: "Pending Rewards", value: stats?.pendingRewards ?? 0, icon: <Clock className="h-4 w-4 text-amber-400" /> },
          { label: "Pending ₹", value: `₹${stats?.pendingAmount ?? 0}`, icon: <Wallet className="h-4 w-4 text-amber-400" /> },
          { label: "Confirmed ₹", value: `₹${stats?.confirmedAmount ?? 0}`, icon: <CheckCircle className="h-4 w-4 text-emerald-400" /> },
          { label: "Paid Out ₹", value: `₹${stats?.totalWithdrawn ?? 0}`, icon: <IndianRupee className="h-4 w-4 text-emerald-400" /> },
          { label: "Withdraw Requests", value: stats?.pendingWithdrawals ?? 0, icon: <ExternalLink className="h-4 w-4 text-amber-400" /> },
        ].map((s) => (
          <div key={s.label} className="glass border border-line rounded-2xl p-3 md:p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted truncate">
              {s.icon}
              {s.label}
            </div>
            <div className="font-display text-base md:text-xl font-bold text-fg">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Referral system overview */}
      <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-4 md:p-5 text-xs md:text-sm text-muted space-y-2">
        <h3 className="font-bold text-fg flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan" />
          How the Referral System Works
        </h3>
        <ul className="list-disc list-inside space-y-1 text-[11px] md:text-xs">
          <li>
            Every user gets a unique referral link. When a friend signs up through it and pays for any project
            (verified via Pay-Panda), the referrer earns <strong className="text-fg">₹100 automatically</strong> — no
            manual confirmation needed.
          </li>
          <li>
            Rewards are <strong className="text-fg">added to the referrer's wallet instantly</strong> (status
            CONFIRMED). Use "Cancel" below only for fraud/refund cases.
          </li>
          <li>
            Minimum withdrawal is <strong className="text-fg">₹100</strong> via UPI. Payout is manual: transfer the
            amount to the user's UPI ID, then enter the transaction/reference ID to mark it Paid — the user gets an
            email and the site updates automatically.
          </li>
          <li>
            Statuses — Rewards: <strong className="text-fg">CONFIRMED / CANCELLED</strong>. Withdrawals:{" "}
            <strong className="text-fg">PENDING (needs action) → PAID / REJECTED</strong>.
          </li>
        </ul>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-line bg-surface/50 p-1 w-fit">
        {[
          {
            key: "withdrawals" as const,
            label: `Withdrawal Requests ${pendingWithdrawals.length > 0 ? `(${pendingWithdrawals.length})` : ""}`,
            icon: <ExternalLink className="h-4 w-4" />,
          },
          { key: "earnings" as const, label: "Referral Rewards", icon: <Wallet className="h-4 w-4" /> },
          { key: "referrers" as const, label: "Referrers", icon: <Users className="h-4 w-4" /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              tab === t.key ? "bg-violet text-white shadow-sm" : "text-muted hover:text-fg"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Withdrawals Tab */}
      {tab === "withdrawals" && (
        <div className="space-y-6">
          {/* Action Required Banner if pending */}
          {pendingWithdrawals.length > 0 && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 md:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-fg">
                    {pendingWithdrawals.length} Withdrawal Request{pendingWithdrawals.length !== 1 ? "s" : ""} Pending Admin Action
                  </h3>
                  <p className="text-xs text-muted">
                    Transfer the requested amount to the user's UPI ID, then enter the Transaction ID to acknowledge payment.
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
                className="bg-surface border border-line rounded-xl px-3 py-2 text-xs text-fg cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending (Requires Action)</option>
                <option value="APPROVED">Paid / Approved</option>
                <option value="PAID">Paid</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="glass border border-line rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface/50 text-left text-muted text-xs">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Requested Amount</th>
                  <th className="px-4 py-3 font-medium">UPI ID</th>
                  <th className="px-4 py-3 font-medium">UPI Holder Name</th>
                  <th className="px-4 py-3 font-medium">Request Date</th>
                  <th className="px-4 py-3 font-medium">Created By</th>
                  <th className="px-4 py-3 font-medium">Updated By</th>
                  <th className="px-4 py-3 font-medium">Updated At</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalsData?.items.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-xs text-muted">
                      No withdrawal requests found.
                    </td>
                  </tr>
                )}
                {withdrawalsData?.items.map((w) => {
                  const isPaid = w.status === "APPROVED" || w.status === "PAID";
                  return (
                    <tr
                      key={w.id}
                      className="border-b border-line/50 last:border-0 hover:bg-surface/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs font-semibold text-fg">{w.userName}</td>
                      <td className="px-4 py-3 text-xs text-muted">{w.userEmail}</td>
                      <td className="px-4 py-3 text-xs font-mono font-bold text-fg">₹{w.amount}</td>
                      <td className="px-4 py-3 text-xs font-mono text-cyan">{w.upiId}</td>
                      <td className="px-4 py-3 text-xs text-fg">{w.upiHolderName}</td>
                      <td className="px-4 py-3 text-[11px] text-muted">
                        {new Date(w.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-muted">{w.createdBy || "—"}</td>
                      <td className="px-4 py-3 text-[11px] text-muted">{w.updatedBy || "—"}</td>
                      <td className="px-4 py-3 text-[11px] text-muted">
                        {w.updatedAt
                          ? new Date(w.updatedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            w.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : isPaid
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {isPaid ? "PAID" : w.status}
                        </span>
                        {w.adminNote && (
                          <div className="text-[10px] text-muted italic mt-0.5 max-w-[150px] truncate">
                            Note: {w.adminNote}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono">
                        {w.transactionId ? (
                          <span className="text-cyan font-semibold">{w.transactionId}</span>
                        ) : (
                          <span className="text-muted text-[11px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {w.status === "PENDING" ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setSelectedWithdrawal(w)}
                            className="text-xs h-7 px-3 gap-1 shadow-sm"
                          >
                            <CreditCard className="h-3 w-3" />
                            Process
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedWithdrawal(w)}
                            className="text-xs h-7 px-2 text-muted hover:text-fg"
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

      {/* Referral Rewards Tab */}
      {tab === "earnings" && (
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <select
              value={earningsFilter}
              onChange={(e) => {
                setEarningsFilter(e.target.value);
                setEarningsPage(1);
              }}
              className="bg-surface border border-line rounded-xl px-3 py-2 text-xs text-fg cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="glass border border-line rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface/50 text-left text-muted text-xs">
                  <th className="px-4 py-3 font-medium">Referrer</th>
                  <th className="px-4 py-3 font-medium">Referred User</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Reward</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {earningsData?.items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted">
                      No referral rewards found.
                    </td>
                  </tr>
                )}
                {earningsData?.items.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-line/50 last:border-0 hover:bg-surface/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="text-fg text-xs font-semibold">{e.referrerName}</div>
                      <div className="text-[10px] text-muted">{e.referrerEmail}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-fg text-xs font-medium">{e.referredName}</div>
                      <div className="text-[10px] text-muted">{e.referredEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-fg max-w-[200px] truncate">{e.projectTitle}</td>
                    <td className="px-4 py-3 text-xs font-mono font-bold text-emerald-400">₹{e.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
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
                    <td className="px-4 py-3 text-[11px] text-muted">
                      {new Date(e.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {e.status === "PENDING" && (
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => updateEarning.mutate({ id: e.id, status: "CONFIRMED" })}
                            className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateEarning.mutate({ id: e.id, status: "CANCELLED" })}
                            className="text-[10px] font-semibold text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-colors cursor-pointer"
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

      {/* Referrers Tab */}
      {tab === "referrers" && (
        <div className="space-y-4">
          <div className="glass border border-line rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface/50 text-left text-muted text-xs">
                  <th className="px-4 py-3 font-medium">Referrer</th>
                  <th className="px-4 py-3 font-medium">Referral Code</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Signups</th>
                  <th className="px-4 py-3 font-medium">Purchases</th>
                  <th className="px-4 py-3 font-medium">Pending ₹</th>
                  <th className="px-4 py-3 font-medium">Confirmed ₹</th>
                  <th className="px-4 py-3 font-medium">Withdrawn ₹</th>
                  <th className="px-4 py-3 font-medium text-right">Available ₹</th>
                </tr>
              </thead>
              <tbody>
                {referrersData?.items.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-xs text-muted">
                      No referral codes created yet.
                    </td>
                  </tr>
                )}
                {referrersData?.items.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-line/50 last:border-0 hover:bg-surface/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="text-fg text-xs font-semibold">{r.referrerName}</div>
                      <div className="text-[10px] text-muted">{r.referrerEmail}</div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[11px] font-mono font-semibold text-cyan">{r.code}</code>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-muted">
                      {new Date(r.joinedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-fg">{r.referrals}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-fg">{r.purchases}</td>
                    <td className="px-4 py-3 text-xs font-mono text-amber-400">₹{r.pending}</td>
                    <td className="px-4 py-3 text-xs font-mono text-emerald-400">₹{r.confirmed}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted">₹{r.withdrawn}</td>
                    <td className="px-4 py-3 text-right text-xs font-mono font-bold text-fg">₹{r.available}</td>
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

      {/* Process Payment & Details Modal */}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
      <div className="glass rounded-2xl border border-line p-5 sm:p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <h3 className="font-display font-bold text-lg text-fg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-400" />
            Withdrawal Request Details
          </h3>
          <button onClick={onClose} className="text-muted hover:text-fg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Amount to Transfer</span>
          <div className="font-display text-3xl font-extrabold text-fg mt-1">₹{withdrawal.amount}</div>
        </div>

        {/* User & UPI Details */}
        <div className="space-y-3 bg-surface-hi/40 rounded-xl border border-line p-4 text-xs">
          <div className="flex justify-between py-1 border-b border-line/40">
            <span className="text-muted">User Name:</span>
            <span className="font-semibold text-fg">{withdrawal.userName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-line/40">
            <span className="text-muted">User Email:</span>
            <span className="font-semibold text-fg">{withdrawal.userEmail}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-line/40">
            <span className="text-muted">UPI Holder Name:</span>
            <span className="font-semibold text-fg">{withdrawal.upiHolderName}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-muted">UPI ID:</span>
            <div className="flex items-center gap-2">
              <code className="font-mono font-bold text-cyan text-sm">{withdrawal.upiId}</code>
              <button
                onClick={handleCopyUpi}
                className="text-muted hover:text-emerald-400 transition-colors p-1"
                title="Copy UPI ID"
              >
                {copiedUpi ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {isPendingStatus ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-surface/50 p-3 text-xs text-muted space-y-1">
              <p className="font-semibold text-fg flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-cyan" />
                Manual Payment Instruction:
              </p>
              <p>
                1. Open your UPI application (Google Pay, PhonePe, Paytm, or NetBanking).
                <br />
                2. Send <strong>₹{withdrawal.amount}</strong> to <strong>{withdrawal.upiId}</strong> ({withdrawal.upiHolderName}).
                <br />
                3. Enter the transaction reference ID below and click <strong>Confirm Payment & Mark Paid</strong>.
              </p>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400">
                {errorMsg}
              </div>
            )}

            {!rejectMode ? (
              <form onSubmit={handleConfirmPaid} className="space-y-4">
                <Field label="Payment Transaction / Reference ID" hint="Required to acknowledge payment">
                  <Input
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. UPI/2026/123456789 or Bank Ref"
                    required
                  />
                </Field>

                <Field label="Admin Note (Optional)">
                  <Input
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Optional message for student"
                  />
                </Field>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isPending || !transactionId.trim()}
                    className="flex-1 gap-2 shadow-md"
                  >
                    <Check className="h-4 w-4" />
                    Confirm Payment & Mark Paid
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
                    placeholder="e.g. Invalid UPI ID, please re-submit"
                    required
                  />
                </Field>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="solid"
                    onClick={handleReject}
                    disabled={isPending}
                    className="flex-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
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
            <div className="flex justify-between py-1 border-b border-line/40">
              <span className="text-muted">Status:</span>
              <span className={`font-bold ${isPaid ? "text-emerald-400" : "text-rose-400"}`}>
                {isPaid ? "PAID" : withdrawal.status}
              </span>
            </div>
            {withdrawal.transactionId && (
              <div className="flex justify-between py-1 border-b border-line/40">
                <span className="text-muted">Transaction ID:</span>
                <span className="font-mono font-bold text-cyan">{withdrawal.transactionId}</span>
              </div>
            )}
            {withdrawal.paidAt && (
              <div className="flex justify-between py-1 border-b border-line/40">
                <span className="text-muted">Paid Date:</span>
                <span className="text-fg">{new Date(withdrawal.paidAt).toLocaleString("en-IN")}</span>
              </div>
            )}
            {withdrawal.adminNote && (
              <div className="flex justify-between py-1">
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
  );
}
