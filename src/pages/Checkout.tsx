import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useCreateCheckout } from "@/api/orders";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { formatINR } from "@/lib/format";

export default function Checkout() {
  const { user } = useAuthStore();
  const { items, clear } = useCartStore();
  const navigate = useNavigate();
  const checkout = useCreateCheckout();
  const [customerName, setCustomerName] = useState(user?.name ?? "");
  const [customerEmail, setCustomerEmail] = useState(user?.email ?? "");
  const [customerMobile, setCustomerMobile] = useState(user?.phone ?? "");
  const [paymentType, setPaymentType] = useState<"FULL" | "ADVANCE">("FULL");

  useEffect(() => {
    if (!user) navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);
    if (items.length === 0) navigate("/cart");
  }, [user, items.length, navigate]);

  const total = items.reduce((sum, item) => sum + (item.discountedPrice ?? item.recommendedPrice ?? item.originalPrice ?? 0), 0);

  const single = items.length === 1 ? items[0] : null;
  const advanceOffer = single?.activeOffer?.advanceType ? single.activeOffer : null;
  const advanceAmount = advanceOffer?.advanceAmount ?? 0;
  const balanceAmount = total - advanceAmount;

  const submit = () => {
    checkout.mutate(
      {
        projectIds: items.map((item) => item.id),
        paymentType: advanceOffer ? paymentType : "FULL",
        customerName,
        customerEmail,
        customerMobile,
      },
      {
        onSuccess: (data) => {
          clear();
          window.location.href = data.checkoutUrl;
        },
      }
    );
  };

  if (!user || items.length === 0) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto aurora grain">
      <div className="mb-8 border-b border-line pb-6">
        <h1 className="font-display text-3xl font-bold text-fg flex items-center gap-3">
          <CreditCard className="h-7 w-7 text-cyan" />
          Checkout
        </h1>
        <p className="text-sm text-muted mt-1">Pay securely through Pay-Panda. We verify the payment before marking your order paid.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <section className="lg:col-span-3 glass rounded-2xl border border-line p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <h2 className="font-display text-lg font-bold text-fg">Student Information</h2>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Encrypted Checkout
            </span>
          </div>

          <Field label="Full Name">
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your full name" />
          </Field>
          <Field label="Email Address (Order Confirmation)">
            <Input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="your.email@example.com" />
          </Field>
          <Field label="Mobile Number (WhatsApp Support Updates)">
            <Input value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} placeholder="+91 9876543210" />
          </Field>

          {advanceOffer && (
            <div className="space-y-3 pt-2">
              <span className="text-sm font-semibold text-fg">Payment Option</span>
              <div className="space-y-2.5">
                <label className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                  paymentType === "FULL" ? "border-violet bg-violet/10 text-fg" : "border-line bg-surface/40 text-muted"
                }`}>
                  <input
                    type="radio"
                    name="paymentType"
                    className="mt-1 accent-violet"
                    checked={paymentType === "FULL"}
                    onChange={() => setPaymentType("FULL")}
                  />
                  <div>
                    <span className="text-sm font-bold text-fg block">
                      Pay Full Amount Now — {formatINR(total)}
                    </span>
                    <span className="text-xs text-muted">Complete access immediately upon payment verification.</span>
                  </div>
                </label>
                <label className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                  paymentType === "ADVANCE" ? "border-violet bg-violet/10 text-fg" : "border-line bg-surface/40 text-muted"
                }`}>
                  <input
                    type="radio"
                    name="paymentType"
                    className="mt-1 accent-violet"
                    checked={paymentType === "ADVANCE"}
                    onChange={() => setPaymentType("ADVANCE")}
                  />
                  <div>
                    <span className="text-sm font-bold text-fg block">
                      Pre-book with Advance Deposit — {formatINR(advanceAmount)}
                    </span>
                    <span className="text-xs text-muted">Lock project slot today. Remaining {formatINR(balanceAmount)} due before handoff.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {checkout.error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-400">
              {(checkout.error as Error).message}
            </div>
          )}

          <Button variant="primary" onClick={submit} disabled={checkout.isPending} className="w-full h-12 text-base shadow-xl shadow-violet-500/25">
            <ShieldCheck className="h-5 w-5" />
            {checkout.isPending
              ? "Securing Pay-Panda Checkout..."
              : advanceOffer && paymentType === "ADVANCE"
              ? `Pre-book Now for ${formatINR(advanceAmount)}`
              : `Pay ${formatINR(total)} via Pay-Panda`}
          </Button>

          <p className="text-center text-[11px] text-faint flex items-center justify-center gap-1.5">
            <span>Guaranteed 100% money-back verification protection by Pay-Panda</span>
          </p>
        </section>

        <aside className="lg:col-span-2 glass rounded-2xl border border-line p-6 space-y-5 self-start">
          <h2 className="font-display font-bold text-fg text-lg pb-3 border-b border-line">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border-b border-line/50 pb-3 space-y-1">
                <Link to={`/project/${item.id}`} className="text-sm font-bold text-fg hover:text-cyan line-clamp-2 leading-snug">
                  {item.projectTitle}
                </Link>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-faint">{item.category?.categoryName || "Full Project Package"}</span>
                  <span className="font-bold text-fg">{formatINR(item.discountedPrice ?? item.recommendedPrice ?? item.originalPrice)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2 text-xs text-muted">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-fg font-semibold">{formatINR(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Code Setup & Support</span>
              <span className="text-emerald-400 font-semibold">Free</span>
            </div>
          </div>

          <div className="border-t border-line pt-4 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-muted">Total Due</span>
            <span className="font-display text-2xl font-black text-fg">
              {advanceOffer && paymentType === "ADVANCE" ? formatINR(advanceAmount) : formatINR(total)}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
