import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Gift,
  Users,
  Share2,
  Wallet,
  Copy,
  Check,
  MessageCircle,
  TrendingUp,
  Award,
  ShoppingCart,
  Loader2,
  Banknote,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  HelpCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Reveal } from "@/components/motion/Reveal";
import { BorderGlow } from "@/components/ui/BorderGlow";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useReferralCode,
  useGenerateReferralCode,
  useReferralEarnings,
  useReferralBalance,
  useWithdrawReferral,
  useWithdrawalHistory,
  useReferredUsers,
} from "@/api/referrals";

export default function ReferAndEarn() {
  const token = useAuthStore((s) => s.token);
  const {
    data: referralCodeData,
    isLoading: codeLoading,
    isError: codeError,
    refetch: refetchCode,
  } = useReferralCode();
  const generateCode = useGenerateReferralCode();
  const [myCode, setMyCode] = useState<string | null>(null);
  const { data: earningsData } = useReferralEarnings();
  const { data: balanceData } = useReferralBalance();
  const withdraw = useWithdrawReferral();
  const { data: withdrawalHistory } = useWithdrawalHistory();
  const { data: referredUsersData } = useReferredUsers();

  const referralCode = referralCodeData?.code ?? myCode ?? earningsData?.code ?? null;
  const userLink = referralCode ? `https://projects.hextorq.tech/explore?ref=${referralCode}` : null;
  const [copied, setCopied] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiHolderName, setUpiHolderName] = useState("");
  const [withdrawValidationError, setWithdrawValidationError] = useState("");

  const copyLink = () => {
    if (!userLink) return;
    navigator.clipboard.writeText(userLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOnWhatsApp = () => {
    if (!userLink) return;
    const message = `Hey! Check out 3,800+ ready final-year engineering projects with full source code, installation, and viva support on HexTorq: ${userLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareOnTelegram = () => {
    if (!userLink) return;
    const message = `Check out final-year engineering projects on HexTorq:`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(userLink)}&text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareOnTwitter = () => {
    if (!userLink) return;
    const message = `Check out ready final-year engineering projects on HexTorq! Full source code, documentation & PPTs included:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(userLink)}`, "_blank");
  };

  const handleAmountChange = (val: string) => {
    setWithdrawAmount(val);
    const num = Number(val);
    const max = balanceData?.availableBalance ?? 0;
    if (!val) {
      setWithdrawValidationError("");
    } else if (num < 100) {
      setWithdrawValidationError("Minimum withdrawal amount is ₹100.");
    } else if (num > max) {
      setWithdrawValidationError(`Maximum withdrawal is ₹${max} (Available Balance).`);
    } else {
      setWithdrawValidationError("");
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    const max = balanceData?.availableBalance ?? 0;

    if (!amount || amount < 100) {
      setWithdrawValidationError("Minimum withdrawal amount is ₹100.");
      return;
    }
    if (amount > max) {
      setWithdrawValidationError(`Maximum withdrawal amount is ₹${max}.`);
      return;
    }
    if (!upiId.trim() || !upiHolderName.trim()) {
      setWithdrawValidationError("Please enter your UPI ID and Account Holder Name.");
      return;
    }

    setWithdrawValidationError("");
    withdraw.mutate(
      { amount, upiId: upiId.trim(), upiHolderName: upiHolderName.trim() },
      {
        onSuccess: () => {
          setWithdrawAmount("");
          setUpiId("");
          setUpiHolderName("");
        },
      }
    );
  };

  const steps = [
    {
      icon: <Share2 className="h-6 w-6 text-violet" />,
      title: "1. Share Your Link",
      desc: "Send your personalized referral link to friends and classmates looking for final-year projects.",
    },
    {
      icon: <Users className="h-6 w-6 text-cyan" />,
      title: "2. Friend Joins & Buys",
      desc: "They sign up and purchase any project. You instantly receive an email confirmation notification.",
    },
    {
      icon: <Wallet className="h-6 w-6 text-emerald-400" />,
      title: "3. Earn ₹100 Instantly",
      desc: "₹100 is credited to your withdrawable wallet for every single project purchased through your link.",
    },
    {
      icon: <Banknote className="h-6 w-6 text-amber-400" />,
      title: "4. Direct UPI Payout",
      desc: "Request a payout to any UPI ID starting from ₹100. Admin transfers and records reference ID.",
    },
  ];

  const benefits = [
    {
      icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
      title: "₹100 Per Purchase",
      desc: "Flat ₹100 reward for every verified project purchase made by your referred friend.",
    },
    {
      icon: <Users className="h-5 w-5 text-violet" />,
      title: "Unlimited Referrals",
      desc: "No caps or limits. The more classmates you refer, the more cash rewards you earn.",
    },
    {
      icon: <Banknote className="h-5 w-5 text-cyan" />,
      title: "Low ₹100 Threshold",
      desc: "Withdraw your earnings straight to your GPay, PhonePe, or Paytm UPI with just ₹100.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-amber-400" />,
      title: "Transparent Tracking",
      desc: "Real-time logs for signups, confirmed purchases, payout statuses, and transaction reference IDs.",
    },
  ];

  const faqs = [
    {
      q: "Who is eligible to participate in the referral program?",
      a: "Any registered student on HexTorq can get their unique referral link immediately upon signing in. Participation is 100% free.",
    },
    {
      q: "When is the ₹100 reward credited to my wallet?",
      a: "The ₹100 reward is credited to your wallet automatically as soon as your referred friend's project purchase payment is verified.",
    },
    {
      q: "What are the rules for withdrawing my earnings?",
      a: "The minimum withdrawal amount is ₹100, and the maximum is your available balance. Simply provide your UPI ID and name to submit a request.",
    },
    {
      q: "How are payouts processed and acknowledged?",
      a: "Our admin processes payouts manually via UPI transfer and records the Transaction/Reference ID. You receive an email receipt and can view the Transaction ID in your dashboard.",
    },
    {
      q: "Can I refer multiple friends or myself?",
      a: "You can refer as many friends and classmates as you wish! Self-referrals or creating duplicate accounts to claim rewards are prohibited and will be disqualified.",
    },
  ];

  const availableBal = balanceData?.availableBalance ?? 0;

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-12 md:space-y-16 aurora grain">
      {/* Hero */}
      <Reveal delay={0.08}>
        <section className="text-center max-w-3xl mx-auto space-y-4 md:space-y-5 px-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 shadow-sm">
            <Gift className="h-3.5 w-3.5 animate-pulse" />
            HexTorq Refer & Earn Hub
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-fg leading-tight">
            Refer a Classmate, <span className="text-gradient">Earn ₹100 Cash</span>
          </h1>
          <p className="text-muted text-sm sm:text-base md:text-lg leading-relaxed font-sans max-w-2xl mx-auto">
            Share your referral link with friends. When they buy any final-year engineering project, you get
            ₹100 credited directly to your UPI-withdrawable balance.
          </p>
        </section>
      </Reveal>

      {/* Referral Link Box */}
      <Reveal delay={0.12}>
        <section className="max-w-2xl mx-auto w-full">
          {!token ? (
            <div className="glass border border-line rounded-2xl p-6 sm:p-8 md:p-10 text-center space-y-5 shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
                <Gift className="h-7 w-7" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-fg tracking-tight">
                Want to Earn <span className="text-gradient">₹100 Per Referral?</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
                Sign in to your student account to get your unique referral link. Share it with friends and earn ₹100 for every project they buy.
              </p>
              <Link to="/login?redirect=/refer-and-earn" className="inline-block w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-emerald-500/20">
                  <Gift className="h-4 w-4" />
                  Sign In to Start Earning
                </Button>
              </Link>
            </div>
          ) : codeLoading && !referralCode ? (
            <div className="glass border border-line rounded-2xl p-8 text-center space-y-3 shadow-lg">
              <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs sm:text-sm text-muted font-medium">Loading your permanent referral link...</p>
            </div>
          ) : referralCode ? (
            <BorderGlow
              edgeSensitivity={30}
              glowColor="#10b981"
              backgroundColor="var(--color-surface)"
              borderRadius={20}
              glowRadius={40}
              glowIntensity={0.8}
              coneSpread={25}
              colors={["#10b981", "#34d399", "#a855f7"]}
              className="w-full"
            >
              <div className="glass border border-line/70 rounded-2xl p-5 sm:p-7 md:p-8 text-center space-y-5">
                <div>
                  <h2 className="font-display font-bold text-fg text-lg sm:text-xl">Your Unique Referral Link</h2>
                  <p className="text-xs sm:text-sm text-muted mt-1">
                    Share this link with classmates. When they sign up & buy, you receive ₹100!
                  </p>
                </div>

                {/* Link Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-bg/90 border border-line rounded-xl p-2">
                  <div className="flex-1 overflow-hidden px-2 py-1 text-center sm:text-left">
                    <code className="text-xs sm:text-sm text-violet-txt font-mono select-all block truncate">
                      {userLink}
                    </code>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <motion.button
                      onClick={copyLink}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                        copied
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                          : "bg-surface-hi border border-line text-fg hover:border-violet/40"
                      }`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-1"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Copied!
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-1"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copy Link
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <Button
                      variant="solid"
                      size="sm"
                      onClick={shareOnWhatsApp}
                      className="flex-1 sm:flex-none gap-1.5 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 text-xs"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="h-3.5 w-3.5 fill-current" />
                      WhatsApp
                    </Button>
                  </div>
                </div>

                {/* Additional Share Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <span className="text-[11px] text-muted mr-1">Quick Share:</span>
                  <button
                    onClick={shareOnTelegram}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan hover:text-cyan-txt bg-cyan/10 border border-cyan/20 hover:bg-cyan/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="h-3 w-3" />
                    Telegram
                  </button>
                  <button
                    onClick={shareOnTwitter}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-fg hover:text-fg/80 bg-surface-hi border border-line hover:border-line/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Twitter (X)
                  </button>
                </div>

                {/* Referral Code details */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted pt-2 border-t border-line/60">
                  <span className="font-mono bg-violet/10 border border-violet/20 px-2.5 py-0.5 rounded-md text-fg font-semibold">
                    Referral Code: <strong>{referralCode}</strong>
                  </span>
                  <span className="text-line hidden sm:inline">|</span>
                  <div className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    ₹100 per verified purchase
                  </div>
                </div>
              </div>
            </BorderGlow>
          ) : codeError && !referralCode ? (
            <div className="glass border border-line rounded-2xl p-6 sm:p-8 md:p-10 text-center space-y-5 shadow-xl">
              <AlertCircle className="h-10 w-10 text-amber-400 mx-auto" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-fg tracking-tight">
                Couldn't Load Your <span className="text-gradient">Referral Link</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
                Something went wrong while fetching your referral link. Check your connection and try again.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="gap-2"
                onClick={() => refetchCode()}
                disabled={codeLoading}
              >
                {codeLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" /> Retry
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="glass border border-line rounded-2xl p-6 sm:p-8 md:p-10 text-center space-y-5 shadow-xl">
              <Gift className="h-10 w-10 text-emerald-400 mx-auto" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-fg tracking-tight">
                Generate Your <span className="text-gradient">Referral Link</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
                Click below to generate your unique link. Share it with friends and receive ₹100 for every project they buy.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="gap-2"
                onClick={() =>
                  generateCode.mutateAsync().then((res) => {
                    setMyCode(res.code);
                  })
                }
                disabled={generateCode.isPending}
              >
                {generateCode.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating Link...
                  </>
                ) : (
                  <>
                    <Gift className="h-4 w-4" /> Generate Referral Link
                  </>
                )}
              </Button>
            </div>
          )}
        </section>
      </Reveal>

      {/* Quick stats grid */}
      <Reveal delay={0.15}>
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
          {[
            {
              label: "Withdrawable",
              value: balanceData ? `₹${balanceData.availableBalance}` : "₹0",
              desc: "Available to withdraw",
              highlight: true,
            },
            {
              label: "Total Earned",
              value: balanceData ? `₹${balanceData.totalEarned}` : "₹0",
              desc: "All confirmed rewards",
            },
            {
              label: "Confirmed",
              value: earningsData ? `₹${earningsData.confirmedAmount}` : "₹0",
              desc: "Verified purchases",
            },
            {
              label: "Pending",
              value: earningsData ? `₹${earningsData.pendingAmount}` : "₹0",
              desc: "In verification process",
            },
            {
              label: "Total Withdrawn",
              value: balanceData ? `₹${balanceData.totalWithdrawn}` : "₹0",
              desc: "Paid to your UPI",
            },
            {
              label: "Friends Joined",
              value: referredUsersData ? `${referredUsersData.users.length}` : "0",
              desc: "Signed up with link",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`glass border rounded-2xl p-3.5 sm:p-4 text-center space-y-1 transition-all hover:border-violet/40 ${
                stat.highlight ? "border-emerald-500/40 bg-emerald-500/10 shadow-sm" : "border-line"
              }`}
            >
              <div className="text-[11px] text-muted font-medium truncate">{stat.label}</div>
              <div className="font-display text-lg sm:text-xl font-bold text-fg">
                {stat.highlight ? <span className="text-emerald-400">{stat.value}</span> : stat.value}
              </div>
              <div className="text-[9px] text-faint truncate">{stat.desc}</div>
            </div>
          ))}
        </section>
      </Reveal>

      {/* Withdraw Section */}
      {token && balanceData && (
        <Reveal delay={0.18}>
          <section className="max-w-4xl mx-auto glass border border-line rounded-2xl p-5 sm:p-7 md:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-display text-fg tracking-tight">
                    UPI Withdrawal Payout
                  </h2>
                  <p className="text-xs text-muted">Direct UPI transfers processed to your bank account</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-muted">
                  Withdrawable Balance:{" "}
                  <strong className="text-emerald-400 font-display text-base">₹{availableBal}</strong>
                </span>
                {!showWithdraw && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setShowWithdraw(true);
                      setWithdrawValidationError("");
                    }}
                    disabled={availableBal < 100}
                    className="gap-1.5 w-full sm:w-auto"
                  >
                    <Banknote className="h-4 w-4" />
                    Request Withdrawal
                  </Button>
                )}
              </div>
            </div>

            {/* Rules badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-hi/40 border border-line text-muted">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Minimum withdrawal:</strong> ₹100
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-hi/40 border border-line text-muted">
                <ShieldCheck className="h-4 w-4 text-cyan shrink-0" />
                <span>
                  <strong>Maximum withdrawal:</strong> ₹{availableBal} (Available Balance)
                </span>
              </div>
            </div>

            {showWithdraw && (
              <form onSubmit={handleWithdrawSubmit} className="max-w-md mx-auto space-y-4 pt-2">
                <Field label="Withdrawal Amount (₹)" hint={`Min: ₹100 | Max: ₹${availableBal}`}>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder={`Enter amount (e.g. 100)`}
                    min={100}
                    max={availableBal}
                    required
                  />
                  {/* Preset Amount Chips */}
                  {availableBal >= 100 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[10px] text-muted mr-1">Presets:</span>
                      {[100, 200, 500].filter((amt) => amt <= availableBal).map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleAmountChange(String(amt))}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-hi border border-line hover:border-violet/40 text-fg transition-colors"
                        >
                          ₹{amt}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAmountChange(String(availableBal))}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      >
                        Max (₹{availableBal})
                      </button>
                    </div>
                  )}
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

                {withdrawValidationError && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{withdrawValidationError}</span>
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
                      Number(withdrawAmount) > availableBal ||
                      !upiId ||
                      !upiHolderName
                    }
                    className="flex-1 gap-2 shadow-md shadow-emerald-500/20"
                  >
                    <Banknote className="h-4 w-4" />
                    {withdraw.isPending ? "Submitting..." : `Withdraw ₹${withdrawAmount || "0"}`}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setShowWithdraw(false);
                      setWithdrawValidationError("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Withdrawal History Table */}
            <div className="space-y-3 pt-4 border-t border-line">
              <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan" />
                Withdrawal Requests & Payout History
              </h3>

              {!withdrawalHistory || withdrawalHistory.length === 0 ? (
                <p className="text-xs text-muted text-center py-4 bg-surface-hi/20 rounded-xl border border-line">
                  No withdrawal requests yet. Request a payout once your balance reaches ₹100.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-line bg-surface/30">
                  <table className="w-full text-sm min-w-[550px]">
                    <thead>
                      <tr className="text-left text-muted text-xs border-b border-line bg-surface/60">
                        <th className="px-3.5 py-2.5 font-medium">Amount</th>
                        <th className="px-3.5 py-2.5 font-medium">UPI Details</th>
                        <th className="px-3.5 py-2.5 font-medium">Status</th>
                        <th className="px-3.5 py-2.5 font-medium">Transaction ID</th>
                        <th className="px-3.5 py-2.5 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawalHistory.map((w) => {
                        const isPaid = w.status === "APPROVED" || w.status === "PAID";
                        return (
                          <tr key={w.id} className="border-b border-line/40 last:border-0 hover:bg-surface/40 transition-colors">
                            <td className="px-3.5 py-3 text-xs font-mono font-bold text-fg">
                              ₹{w.amount}
                            </td>
                            <td className="px-3.5 py-3 text-xs">
                              <div className="font-mono text-fg">{w.upiId}</div>
                              <div className="text-[10px] text-muted">{w.upiHolderName}</div>
                            </td>
                            <td className="px-3.5 py-3">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
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
                                <div className="text-[10px] text-muted italic mt-0.5">Note: {w.adminNote}</div>
                              )}
                            </td>
                            <td className="px-3.5 py-3 text-xs font-mono">
                              {w.transactionId ? (
                                <span className="text-cyan font-semibold">{w.transactionId}</span>
                              ) : isPaid ? (
                                <span className="text-emerald-400">Completed</span>
                              ) : (
                                <span className="text-muted text-[11px]">—</span>
                              )}
                            </td>
                            <td className="px-3.5 py-3 text-[11px] text-muted">
                              <div>{new Date(w.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                              {w.paidAt && (
                                <div className="text-[9px] text-emerald-400 font-medium">
                                  Paid: {new Date(w.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </Reveal>
      )}

      {/* Referral Earnings Breakdown */}
      {token && earningsData && earningsData.earnings.length > 0 && (
        <Reveal delay={0.2}>
          <section className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-violet" />
              <h2 className="text-xl font-bold font-display text-fg tracking-tight">
                Referral Rewards Log
              </h2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-line glass">
              <table className="w-full text-sm min-w-[550px]">
                <thead>
                  <tr className="border-b border-line bg-surface/50 text-muted text-left text-xs">
                    <th className="px-4 py-3 font-medium">Referred Friend</th>
                    <th className="px-4 py-3 font-medium">Project Title</th>
                    <th className="px-4 py-3 font-medium">Reward</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.earnings.map((ref) => (
                    <tr key={ref.id} className="border-b border-line/50 last:border-0 hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-fg text-xs font-semibold">{ref.referredName}</div>
                        <div className="text-[10px] text-muted">{ref.referredEmail}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-fg max-w-[200px] truncate">{ref.projectTitle}</td>
                      <td className="px-4 py-3 text-xs font-mono font-bold text-emerald-400">₹{ref.amount}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            ref.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : ref.status === "CONFIRMED"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted text-xs">
                        {new Date(ref.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </Reveal>
      )}

      {/* Friends Who Signed Up */}
      {token && referredUsersData && referredUsersData.users.length > 0 && (
        <Reveal delay={0.22}>
          <section className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan" />
              <h2 className="text-xl font-bold font-display text-fg tracking-tight">
                Friends Who Joined With Your Link
              </h2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-line glass">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-line bg-surface/50 text-muted text-left text-xs">
                    <th className="px-4 py-3 font-medium">Friend Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Signup Date</th>
                    <th className="px-4 py-3 font-medium">Purchase Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referredUsersData.users.map((u) => (
                    <tr key={u.id} className="border-b border-line/50 last:border-0 hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-fg font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-xs text-muted">{u.email}</td>
                      <td className="px-4 py-3 text-muted text-xs">
                        {new Date(u.signedUpAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {u.purchased ? (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Check className="h-3 w-3" />
                            Purchased — ₹100 Added
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <ShoppingCart className="h-3 w-3" />
                            Browsing Catalogue
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </Reveal>
      )}

      {/* How It Works */}
      <section className="space-y-8">
        <Reveal delay={0.1} className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-fg tracking-tight">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
            Four simple steps to start earning cash rewards with every successful project purchase
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((s, idx) => (
            <Reveal key={idx} delay={idx * 0.08} className="h-full">
              <BorderGlow
                edgeSensitivity={30}
                glowColor={idx === 0 ? "#a855f7" : idx === 1 ? "#06b6d4" : idx === 2 ? "#34d399" : "#fbbf24"}
                backgroundColor="var(--color-surface)"
                borderRadius={20}
                glowRadius={40}
                glowIntensity={0.8}
                coneSpread={25}
                colors={
                  idx === 0
                    ? ["#a855f7", "#c084fc", "#38bdf8"]
                    : idx === 1
                    ? ["#06b6d4", "#22d3ee", "#a855f7"]
                    : idx === 2
                    ? ["#34d399", "#6ee7b7", "#a855f7"]
                    : ["#fbbf24", "#fcd34d", "#38bdf8"]
                }
                className="h-full group"
              >
                <div className="glass p-6 rounded-2xl border border-line flex flex-col justify-between h-full hover:border-violet/40 hover:-translate-y-0.5 transition-all">
                  <div className="space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-line text-xs font-bold text-muted">
                      0{idx + 1}
                    </span>
                    <div className="p-3 bg-surface rounded-xl inline-block border border-line">{s.icon}</div>
                    <h3 className="font-display font-bold text-fg text-base">{s.title}</h3>
                    <p className="text-xs text-muted leading-relaxed font-sans">{s.desc}</p>
                  </div>
                </div>
              </BorderGlow>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Program Benefits */}
      <Reveal delay={0.1}>
        <section className="glass border border-line rounded-3xl p-6 sm:p-8 md:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-fg tracking-tight">Program Benefits</h2>
            <p className="text-xs sm:text-sm text-muted">Why student engineers love referring on HexTorq</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {benefits.map((b, idx) => (
              <div key={idx} className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-surface-hi border border-line w-fit">{b.icon}</div>
                <h4 className="font-display font-semibold text-fg text-sm">{b.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* FAQ */}
      <Reveal delay={0.1}>
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-fg tracking-tight">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-xs text-muted">Everything you need to know about the referral system</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass border border-line rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="font-display font-semibold text-fg text-sm flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-muted leading-relaxed pl-3.5">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
