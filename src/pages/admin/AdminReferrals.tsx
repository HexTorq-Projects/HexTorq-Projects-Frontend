import { useState } from "react";
import { Gift, Users, Wallet, CheckCircle, XCircle, Eye, ExternalLink, Search, ChevronDown, IndianRupee } from "lucide-react";
import { useAdminReferralStats, useAdminReferralEarnings, useUpdateAdminReferralEarning, useAdminReferralWithdrawals, useUpdateAdminReferralWithdrawal } from "@/api/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminReferrals() {
  const [tab, setTab] = useState<"earnings" | "withdrawals">("earnings");
  const [earningsPage, setEarningsPage] = useState(1);
  const [withdrawalsPage, setWithdrawalsPage] = useState(1);
  const [earningsFilter, setEarningsFilter] = useState("");
  const [withdrawalsFilter, setWithdrawalsFilter] = useState("");

  const { data: stats } = useAdminReferralStats();
  const { data: earningsData } = useAdminReferralEarnings(earningsPage, earningsFilter || undefined);
  const { data: withdrawalsData } = useAdminReferralWithdrawals(withdrawalsPage, withdrawalsFilter || undefined);
  const updateEarning = useUpdateAdminReferralEarning();
  const updateWithdrawal = useUpdateAdminReferralWithdrawal();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fg flex items-center gap-2">
          <Gift className="h-6 w-6 text-emerald-400" />
          Referral Management
        </h1>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Codes", value: stats?.totalCodes ?? 0, icon: <Users className="h-4 w-4 text-violet" /> },
          { label: "Total Earnings", value: stats?.totalEarnings ?? 0, icon: <Gift className="h-4 w-4 text-cyan" /> },
          { label: "Pending ₹", value: `₹${stats?.pendingAmount ?? 0}`, icon: <Wallet className="h-4 w-4 text-amber-400" /> },
          { label: "Confirmed ₹", value: `₹${stats?.confirmedAmount ?? 0}`, icon: <CheckCircle className="h-4 w-4 text-emerald-400" /> },
          { label: "Withdrawn ₹", value: `₹${stats?.totalWithdrawn ?? 0}`, icon: <IndianRupee className="h-4 w-4 text-rose-400" /> },
        ].map((s) => (
          <div key={s.label} className="glass border border-line rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted">
              {s.icon}
              {s.label}
            </div>
            <div className="font-display text-xl font-bold text-fg">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-line bg-surface/50 p-1 w-fit">
        {[
          { key: "earnings" as const, label: "Earnings", icon: <Wallet className="h-4 w-4" /> },
          { key: "withdrawals" as const, label: "Withdrawals", icon: <ExternalLink className="h-4 w-4" /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              tab === t.key ? "bg-violet text-white shadow-sm" : "text-muted hover:text-fg"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Earnings tab */}
      {tab === "earnings" && (
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <select
              value={earningsFilter}
              onChange={(e) => { setEarningsFilter(e.target.value); setEarningsPage(1); }}
              className="bg-surface border border-line rounded-xl px-3 py-2 text-xs text-fg cursor-pointer"
            >
              <option value="">All status</option>
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
                  <th className="px-4 py-3 font-medium">Referred</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {earningsData?.items.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-xs text-muted">No earnings found</td></tr>
                )}
                {earningsData?.items.map((e) => (
                  <tr key={e.id} className="border-b border-line/50 last:border-0 hover:bg-surface/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-fg text-xs font-medium">{e.referrerName}</div>
                      <div className="text-[10px] text-muted">{e.referrerEmail}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-fg text-xs">{e.referredName}</div>
                      <div className="text-[10px] text-muted">{e.referredEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-fg max-w-[160px] truncate">{e.projectTitle}</td>
                    <td className="px-4 py-3 text-xs font-mono text-fg">₹{e.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        e.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : e.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-muted">
                      {new Date(e.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      {e.status === "PENDING" && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => updateEarning.mutate({ id: e.id, status: "CONFIRMED" })}
                            className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateEarning.mutate({ id: e.id, status: "CANCELLED" })}
                            className="text-[10px] font-semibold text-rose-400 hover:text-rose-300 px-2 py-1 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
            <div className="flex justify-center gap-2">
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

      {/* Withdrawals tab */}
      {tab === "withdrawals" && (
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <select
              value={withdrawalsFilter}
              onChange={(e) => { setWithdrawalsFilter(e.target.value); setWithdrawalsPage(1); }}
              className="bg-surface border border-line rounded-xl px-3 py-2 text-xs text-fg cursor-pointer"
            >
              <option value="">All status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div className="glass border border-line rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface/50 text-left text-muted text-xs">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">UPI ID</th>
                  <th className="px-4 py-3 font-medium">UPI Holder</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalsData?.items.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-xs text-muted">No withdrawal requests</td></tr>
                )}
                {withdrawalsData?.items.map((w) => (
                  <WithdrawalRow key={w.id} withdrawal={w} onUpdate={updateWithdrawal.mutate} />
                ))}
              </tbody>
            </table>
          </div>
          {withdrawalsData && withdrawalsData.totalPages > 1 && (
            <div className="flex justify-center gap-2">
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
    </div>
  );
}

function WithdrawalRow({ withdrawal, onUpdate }: { withdrawal: any; onUpdate: (args: { id: string; status: string; adminNote?: string }) => void }) {
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  return (
    <tr className="border-b border-line/50 last:border-0 hover:bg-surface/30 transition-colors">
      <td className="px-4 py-3">
        <div className="text-fg text-xs font-medium">{withdrawal.userName}</div>
        <div className="text-[10px] text-muted">{withdrawal.userEmail}</div>
      </td>
      <td className="px-4 py-3 text-xs font-mono text-fg font-bold">₹{withdrawal.amount}</td>
      <td className="px-4 py-3 text-xs text-fg">{withdrawal.upiId}</td>
      <td className="px-4 py-3 text-xs text-fg">{withdrawal.upiHolderName}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
          withdrawal.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          : withdrawal.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
        }`}>
          {withdrawal.status}
        </span>
      </td>
      <td className="px-4 py-3 text-[10px] text-muted">
        {new Date(withdrawal.createdAt).toLocaleDateString("en-IN")}
      </td>
      <td className="px-4 py-3">
        {withdrawal.status === "PENDING" && (
          <div className="space-y-2">
            <div className="flex gap-1.5">
              <button
                onClick={() => onUpdate({ id: withdrawal.id, status: "APPROVED", adminNote: note || undefined })}
                className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={() => setShowNote(!showNote)}
                className="text-[10px] font-semibold text-rose-400 hover:text-rose-300 px-2 py-1 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                Reject
              </button>
            </div>
            {showNote && (
              <div className="flex gap-1.5">
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Reason (optional)"
                  className="w-28 bg-bg border border-line rounded-lg px-2 py-1 text-[10px] text-fg placeholder:text-faint outline-none"
                />
                <button
                  onClick={() => { onUpdate({ id: withdrawal.id, status: "REJECTED", adminNote: note || undefined }); setShowNote(false); }}
                  className="text-[10px] font-semibold text-rose-400 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        )}
        {withdrawal.adminNote && (
          <div className="text-[9px] text-muted italic mt-1">Note: {withdrawal.adminNote}</div>
        )}
      </td>
    </tr>
  );
}
