import { useState } from "react";
import { X, Banknote, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { useWithdrawReferral } from "@/api/referrals";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export function WithdrawalModal({
  isOpen,
  onClose,
  availableBalance,
}: WithdrawalModalProps) {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiHolderName, setUpiHolderName] = useState("");
  const [validationError, setValidationError] = useState("");
  const withdraw = useWithdrawReferral();

  if (!isOpen) return null;

  const handleAmountChange = (val: string) => {
    setWithdrawAmount(val);
    const num = Number(val);
    if (!val) {
      setValidationError("");
    } else if (num < 100) {
      setValidationError("Minimum withdrawal amount is ₹100");
    } else if (num > availableBalance) {
      setValidationError(`Maximum withdrawal is ₹${availableBalance} (Available Balance)`);
    } else {
      setValidationError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(withdrawAmount);

    if (num < 100) {
      setValidationError("Minimum withdrawal amount is ₹100");
      return;
    }
    if (num > availableBalance) {
      setValidationError(`Maximum withdrawal is ₹${availableBalance} (Available Balance)`);
      return;
    }
    if (!upiId.trim() || !upiHolderName.trim()) {
      setValidationError("Please enter your UPI ID and Account Holder Name");
      return;
    }

    setValidationError("");
    withdraw.mutate(
      {
        amount: num,
        upiId: upiId.trim(),
        upiHolderName: upiHolderName.trim(),
      },
      {
        onSuccess: () => {
          setWithdrawAmount("");
          setUpiId("");
          setUpiHolderName("");
          setTimeout(() => {
            onClose();
          }, 1800);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md">
      <div className="glass rounded-2xl border border-line p-5 sm:p-7 max-w-md w-full space-y-5 max-h-[92vh] overflow-y-auto relative shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-fg">
                Request UPI Payout
              </h3>
              <p className="text-[11px] text-muted">Direct transfer to your bank account via UPI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-fg transition-colors p-1 rounded-lg hover:bg-surface-hi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Balance details */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-hi/40 border border-line">
          <span className="text-xs text-muted">Withdrawable Balance:</span>
          <span className="font-display text-lg font-bold text-emerald-400">
            ₹{availableBalance}
          </span>
        </div>

        {availableBalance < 100 ? (
          <div className="space-y-4 py-2 text-center">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed">
              <p className="font-semibold text-sm mb-1 text-amber-200">Minimum ₹100 Required</p>
              Your current withdrawable balance is <strong>₹{availableBalance}</strong>. You can request a payout once your referred friends complete a project purchase (₹100 reward per purchase).
            </div>
            <Button variant="primary" onClick={onClose} className="w-full">
              Got it
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Withdrawal Amount (₹)" hint={`Min: ₹100 | Max: ₹${availableBalance}`}>
              <Input
                type="number"
                value={withdrawAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Enter amount (e.g. 100)"
                min={100}
                max={availableBalance}
                required
              />
              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-muted mr-1">Presets:</span>
                {[100, 200, 500].filter((amt) => amt <= availableBalance).map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleAmountChange(String(amt))}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-hi border border-line hover:border-violet/40 text-fg transition-colors cursor-pointer"
                  >
                    ₹{amt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleAmountChange(String(availableBalance))}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                >
                  Max (₹{availableBalance})
                </button>
              </div>
            </Field>

            <Field label="UPI ID (VPA)" hint="e.g. yourname@okaxis, 9876543210@paytm">
              <Input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                required
              />
            </Field>

            <Field label="Account Holder Name" hint="As registered in your UPI / Bank app">
              <Input
                value={upiHolderName}
                onChange={(e) => setUpiHolderName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </Field>

            {validationError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {withdraw.error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{(withdraw.error as Error).message}</span>
              </div>
            )}

            {withdraw.isSuccess && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Withdrawal request submitted! Admin will process payment shortly.</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                type="submit"
                disabled={
                  withdraw.isPending ||
                  !withdrawAmount ||
                  Number(withdrawAmount) < 100 ||
                  Number(withdrawAmount) > availableBalance ||
                  !upiId ||
                  !upiHolderName
                }
                className="flex-1 gap-2 shadow-md shadow-emerald-500/20"
              >
                {withdraw.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Banknote className="h-4 w-4" />
                    Withdraw ₹{withdrawAmount || "0"}
                  </>
                )}
              </Button>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default WithdrawalModal;
