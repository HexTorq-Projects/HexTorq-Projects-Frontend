import { useState } from "react";
import { Link } from "react-router-dom";
import { Gift, Users, Share2, Wallet, Copy, Check, MessageCircle, ChevronRight, TrendingUp, Award, ShoppingCart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { BorderGlow } from "@/components/ui/BorderGlow";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { useReferralCode, useReferralEarnings } from "@/api/referrals";

export default function ReferAndEarn() {
  const token = useAuthStore((s) => s.token);
  const { data: codeData, isLoading: codeLoading } = useReferralCode();
  const { data: earningsData } = useReferralEarnings();
  const referralCode = codeData?.code ?? "YOUR_CODE";
  const userLink = `https://projects.hextorq.tech/explore?ref=${referralCode}`;
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(userLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const steps = [
    {
      icon: <Share2 className="h-6 w-6 text-violet" />,
      title: "Share Your Referral Link",
      desc: "Share your unique referral link with friends and classmates who need final-year projects.",
    },
    {
      icon: <ShoppingCart className="h-6 w-6 text-cyan" />,
      title: "They Buy a Project",
      desc: "Your friend browses 3,800+ projects and purchases one using your referral link.",
    },
    {
      icon: <Wallet className="h-6 w-6 text-emerald-400" />,
      title: "You Earn ₹100",
      desc: "You get ₹100 credited to your account for every project purchased through your referral.",
    },
    {
      icon: <Award className="h-6 w-6 text-amber-400" />,
      title: "No Limits, Keep Earning",
      desc: "Refer as many friends as you want. There is no cap on how much you can earn.",
    },
  ];

  const benefits = [
    {
      icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
      title: "₹100 per referral",
      desc: "Earn a flat ₹100 for every project bought through your link — no minimum threshold.",
    },
    {
      icon: <Users className="h-5 w-5 text-violet" />,
      title: "Unlimited referrals",
      desc: "Refer unlimited friends. Each successful referral adds ₹100 to your earnings.",
    },
    {
      icon: <Gift className="h-5 w-5 text-cyan" />,
      title: "No expiry",
      desc: "Your earnings never expire. Use them for your own project purchase or withdraw.",
    },
    {
      icon: <Wallet className="h-5 w-5 text-amber-400" />,
      title: "Track in dashboard",
      desc: "Monitor your referrals, earnings, and payout history from your dashboard in real time.",
    },
  ];

  const faqs = [
    {
      q: "Who can refer?",
      a: "Any registered user on Hextorq can generate a referral link and start earning. If you do not have an account, sign up for free.",
    },
    {
      q: "When do I get paid?",
      a: "₹100 is credited to your Hextorq wallet once your referral's project purchase is confirmed and delivered.",
    },
    {
      q: "Can I refer myself?",
      a: "No. Referral links are tracked by IP and account. Self-referrals or fraudulent activity will result in disqualification.",
    },
    {
      q: "How do I withdraw earnings?",
      a: "You can use your referral balance towards your own project purchase, or request a withdrawal to your UPI account once the balance reaches ₹1,000.",
    },
  ];

  return (
    <div className="min-h-screen pt-32 md:pt-36 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-16 aurora grain">
      {/* Hero */}
      <Reveal delay={0.1}>
        <section className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Gift className="h-3.5 w-3.5" />
            Refer & Earn
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-fg leading-snug">
            Refer a Friend, <span className="text-gradient">Earn ₹100</span>
          </h1>
          <p className="text-muted text-base md:text-lg leading-relaxed font-sans max-w-2xl mx-auto">
            Share your referral link with friends. When they buy a project through your link, you get
            ₹100 credited to your account. Unlimited referrals, no caps.
          </p>
        </section>
      </Reveal>

      {/* Referral Link Box */}
      <Reveal delay={0.15}>
        <section className="max-w-2xl mx-auto">
          <BorderGlow
            edgeSensitivity={30}
            glowColor="#10b981"
            backgroundColor="var(--color-surface)"
            borderRadius={20}
            glowRadius={40}
            glowIntensity={0.8}
            coneSpread={25}
            colors={['#10b981', '#34d399', '#a855f7']}
            className="w-full"
          >
            <div className="glass border border-line/70 rounded-2xl p-6 md:p-8 text-center space-y-4">
              <h2 className="font-display font-semibold text-fg text-lg">Your Referral Link</h2>
              <p className="text-sm text-muted">
                {token
                  ? "Share this link with your friends to start earning"
                  : "Sign in to get your unique referral link"}
              </p>
              <div className="flex items-center gap-2 bg-bg/80 border border-line rounded-xl p-1.5">
                <code className="flex-1 text-xs sm:text-sm text-fg font-mono truncate px-2 select-all">
                  {codeLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    userLink
                  )}
                </code>
                <motion.button
                  onClick={copyLink}
                  whileTap={{ scale: 0.9 }}
                  className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    copied
                      ? "bg-emerald-500 text-white"
                      : "bg-surface-hi border border-line text-muted hover:text-fg hover:border-violet/40"
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
                        Copied
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
                        Copy
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5 text-cyan" />
                  Share on WhatsApp
                </div>
                <span className="text-line">|</span>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-violet" />
                  Unlimited referrals
                </div>
              </div>
            </div>
          </BorderGlow>
        </section>
      </Reveal>

      {/* Quick stats */}
      <Reveal delay={0.1}>
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Per Referral", value: "₹100", desc: "Flat rate" },
            {
              label: "Your Earnings",
              value: earningsData ? `₹${earningsData.totalEarned}` : "₹0",
              desc: earningsData ? `${earningsData.count} referral${earningsData.count !== 1 ? "s" : ""}` : "Track earnings",
            },
            { label: "Payout Threshold", value: "₹1,000", desc: "UPI withdrawal" },
            { label: "Referral Cap", value: "None", desc: "Unlimited" },
          ].map((stat) => (
            <div key={stat.label} className="glass border border-line rounded-2xl p-4 text-center space-y-0.5">
              <div className="text-xs text-muted">{stat.label}</div>
              <div className="font-display text-xl md:text-2xl font-bold text-gradient">{stat.value}</div>
              <div className="text-[10px] text-faint">{stat.desc}</div>
            </div>
          ))}
        </section>
      </Reveal>

      {/* Referral History */}
      {token && earningsData && earningsData.earnings.length > 0 && (
        <Reveal delay={0.1}>
          <section className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-violet" />
              <h2 className="text-xl font-bold font-display text-fg tracking-tight">
                Your Referrals
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm glass border border-line rounded-2xl overflow-hidden">
                <thead>
                  <tr className="border-b border-line bg-surface/50 text-muted text-left">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.earnings.map((ref) => (
                    <tr key={ref.id} className="border-b border-line/50 last:border-0 hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-3 text-fg">{ref.referredName}</td>
                      <td className="px-4 py-3 text-muted">{ref.referredEmail}</td>
                      <td className="px-4 py-3 text-fg">{ref.projectTitle}</td>
                      <td className="px-4 py-3 text-fg font-mono">₹{ref.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          ref.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : ref.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {ref.status === "PENDING" ? "Pending" : ref.status === "CONFIRMED" ? "Confirmed" : "Cancelled"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted text-xs">
                        {new Date(ref.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
          <h2 className="text-2xl md:text-3xl font-bold font-display text-fg tracking-tight">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-sm text-muted max-w-xl mx-auto">
            Three simple steps to start earning with every successful referral
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <Reveal key={idx} delay={idx * 0.08} className="h-full">
              <BorderGlow
                edgeSensitivity={30}
                glowColor={
                  idx === 0 ? "#a855f7" : idx === 1 ? "#06b6d4" : idx === 2 ? "#34d399" : "#fbbf24"
                }
                backgroundColor="var(--color-surface)"
                borderRadius={20}
                glowRadius={40}
                glowIntensity={0.8}
                coneSpread={25}
                colors={
                  idx === 0
                    ? ['#a855f7', '#c084fc', '#38bdf8']
                    : idx === 1
                    ? ['#06b6d4', '#22d3ee', '#a855f7']
                    : idx === 2
                    ? ['#34d399', '#6ee7b7', '#a855f7']
                    : ['#fbbf24', '#fcd34d', '#38bdf8']
                }
                className="h-full group"
              >
                <div className="glass p-6 rounded-2xl border border-line flex flex-col justify-between h-full hover:border-violet/40 hover:-translate-y-0.5 transition-all">
                  <div className="space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-line text-xs font-bold text-muted">
                      0{idx + 1}
                    </span>
                    <div className="p-3 bg-surface rounded-xl inline-block border border-line">
                      {s.icon}
                    </div>
                    <h3 className="font-display font-semibold text-fg text-base">{s.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </BorderGlow>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <Reveal delay={0.1}>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 text-xs font-semibold text-cyan">
              <Award className="h-3.5 w-3.5" />
              Why Refer?
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-fg tracking-tight leading-tight">
              Earn While Helping Friends <span className="text-gradient">Succeed</span>
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              You already know how valuable a good final-year project is. Share that advantage with
              your friends and earn ₹100 every time they buy through your link. It is a win-win —
              they get a production-grade project, you get rewarded.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="grid gap-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex gap-3.5 items-start glass border border-line rounded-2xl p-4 transition-all duration-300 hover:border-violet/30 hover:-translate-y-0.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface border border-line">
                  {b.icon}
                </span>
                <div className="space-y-0.5">
                  <h3 className="font-display font-semibold text-fg text-sm">{b.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <Reveal delay={0.1}>
        <section className="glass border border-line rounded-3xl p-8 md:p-12 text-center space-y-5 max-w-3xl mx-auto">
          <Gift className="h-10 w-10 text-emerald-400 mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold font-display text-fg tracking-tight">
            Ready to Start <span className="text-gradient">Earning?</span>
          </h2>
          <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">
            Sign in to get your referral link, or contact us on WhatsApp to learn more about the program.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/login">
              <Button variant="primary" size="lg">
                Sign In to Get Your Link
              </Button>
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Hextorq, I want to know more about the Refer & Earn program.")}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </section>
      </Reveal>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto space-y-8">
        <Reveal delay={0.1}>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-fg tracking-tight text-center">
            Frequently Asked Questions
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <Reveal key={idx} delay={0.1 + idx * 0.05}>
              <div className="space-y-2">
                <h4 className="font-display font-medium text-fg flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-violet shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-muted leading-relaxed pl-6">{faq.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <Reveal delay={0.1}>
        <section className="text-center pt-4">
          <Link to="/explore">
            <Button variant="primary" size="lg">
              Browse 3,800+ Projects
            </Button>
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
