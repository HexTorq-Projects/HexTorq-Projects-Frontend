import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight, LogIn } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import { Button } from "@/components/ui/Button";
import { PriceBlock } from "@/components/project/PriceBlock";
import { formatINR } from "@/lib/format";

export default function Cart() {
  const { items, remove, clear } = useCartStore();
  const { user } = useAuthStore();
  const { openAuth } = useUiStore();
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + (item.discountedPrice ?? item.recommendedPrice ?? item.originalPrice ?? 0), 0);

  const checkout = () => {
    if (!user) {
      openAuth("login", "/checkout");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto aurora grain">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-fg flex items-center gap-3">
            <ShoppingCart className="h-7 w-7 text-cyan" />
            Cart
          </h1>
          <p className="text-sm text-muted mt-1">Review selected project packages before Pay-Panda checkout.</p>
        </div>
        {items.length > 0 && (
          <Button variant="ghost" onClick={clear}>Clear cart</Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface/30 py-16 text-center">
          <ShoppingCart className="h-10 w-10 text-faint mx-auto mb-3" />
          <h2 className="font-display text-xl font-semibold text-fg">Your cart is empty</h2>
          <p className="text-sm text-muted mt-1 mb-6">Add projects from the catalogue to start checkout.</p>
          <Link to="/explore">
            <Button variant="primary">Browse Projects</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((project) => (
              <div key={project.id} className="glass rounded-2xl border border-line p-5 flex flex-col md:flex-row gap-5 justify-between items-start hover:border-violet/30 transition-all">
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-cyan tracking-wider uppercase bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded-md">
                      {project.category?.categoryName || "Engineering"}
                    </span>
                    {project.sellabilityTier && (
                      <span className="text-[10px] font-bold text-violet-txt tracking-wider uppercase bg-violet/10 border border-violet/20 px-2 py-0.5 rounded-md">
                        {project.sellabilityTier}
                      </span>
                    )}
                  </div>
                  <Link to={`/project/${project.id}`} className="font-display font-bold text-fg hover:text-cyan transition-colors text-base leading-snug block">
                    {project.projectTitle}
                  </Link>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">{project.brief}</p>
                  <div className="pt-1">
                    <PriceBlock recommended={project.recommendedPrice} discounted={project.discountedPrice} original={project.originalPrice} size="sm" />
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => remove(project.id)} className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 shrink-0 self-start">
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 self-start glass rounded-2xl border border-line p-6 space-y-6">
            <h2 className="font-display text-lg font-bold text-fg pb-3 border-b border-line">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted">
                <span>Selected Items</span>
                <span className="text-fg font-semibold">{items.length} package(s)</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Code Verification</span>
                <span className="text-emerald-400 font-semibold">Included</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Documentation & SRS</span>
                <span className="text-emerald-400 font-semibold">Included</span>
              </div>
            </div>

            <div className="border-t border-line pt-4 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-muted">Total Amount</span>
              <span className="font-display text-2xl font-black text-fg">{formatINR(total)}</span>
            </div>

            <Button variant="primary" onClick={checkout} className="w-full h-12 text-base shadow-lg shadow-violet-500/25">
              {user ? <ArrowRight className="h-4.5 w-4.5" /> : <LogIn className="h-4.5 w-4.5" />}
              {user ? "Proceed to Checkout" : "Sign in to Checkout"}
            </Button>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-line/60 space-y-2 text-[11px] text-faint">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>256-Bit SSL Encrypted & Pay-Panda Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-cyan" />
                <span>Instant Digital Handoff & Viva Assistance</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
