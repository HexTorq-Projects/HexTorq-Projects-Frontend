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
        <section className="lg:col-span-3 rounded-2xl border border-line bg-surface/60 p-6 space-y-5">
          <Field label="Name">
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
          </Field>
          <Field label="Mobile">
            <Input value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} />
          </Field>

          {advanceOffer && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-fg">How would you like to pay?</span>
              <label className="flex items-start gap-3 rounded-xl border border-line bg-bg-soft p-3 cursor-pointer">
                <input
                  type="radio"
                  className="mt-1"
                  checked={paymentType === "FULL"}
                  onChange={() => setPaymentType("FULL")}
                />
                <span className="text-sm text-fg">
                  Pay full amount now — <span className="font-semibold">{formatINR(total)}</span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-line bg-bg-soft p-3 cursor-pointer">
                <input
                  type="radio"
                  className="mt-1"
                  checked={paymentType === "ADVANCE"}
                  onChange={() => setPaymentType("ADVANCE")}
                />
                <span className="text-sm text-fg">
                  Pre-book for <span className="font-semibold">{formatINR(advanceAmount)}</span> now — remaining{" "}
                  <span className="font-semibold">{formatINR(balanceAmount)}</span> due later
                </span>
              </label>
            </div>
          )}

          {checkout.error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
              {(checkout.error as Error).message}
            </div>
          )}
          <Button variant="primary" onClick={submit} disabled={checkout.isPending} className="w-full">
            <ShieldCheck className="h-4 w-4" />
            {checkout.isPending
              ? "Creating Pay-Panda checkout..."
              : advanceOffer && paymentType === "ADVANCE"
              ? `Pre-book for ${formatINR(advanceAmount)}`
              : "Pay with Pay-Panda"}
          </Button>
        </section>

        <aside className="lg:col-span-2 rounded-2xl border border-line bg-surface/70 p-6 space-y-4 self-start">
          <h2 className="font-display font-semibold text-fg">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="border-b border-line/50 pb-3">
                <Link to={`/project/${item.id}`} className="text-sm font-medium text-fg hover:text-cyan line-clamp-2">
                  {item.projectTitle}
                </Link>
                <p className="text-xs text-muted mt-1">{formatINR(item.discountedPrice ?? item.recommendedPrice ?? item.originalPrice)}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted">Total</span>
            <span className="font-display text-2xl font-bold text-fg">{formatINR(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
