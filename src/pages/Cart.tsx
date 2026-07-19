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
              <div key={project.id} className="rounded-2xl border border-line bg-surface/60 p-5 flex flex-col md:flex-row gap-4 justify-between">
                <div className="space-y-2">
                  <Link to={`/project/${project.id}`} className="font-display font-semibold text-fg hover:text-cyan transition-colors">
                    {project.projectTitle}
                  </Link>
                  <p className="text-sm text-muted line-clamp-2">{project.brief}</p>
                  <PriceBlock recommended={project.recommendedPrice} discounted={project.discountedPrice} original={project.originalPrice} size="sm" />
                </div>
                <Button variant="ghost" size="sm" onClick={() => remove(project.id)} className="self-start text-rose-400">
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 self-start rounded-2xl border border-line bg-surface/70 p-6 space-y-5">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>Items</span>
              <span className="text-fg font-semibold">{items.length}</span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-5">
              <span className="text-sm text-muted">Total</span>
              <span className="font-display text-2xl font-bold text-fg">{formatINR(total)}</span>
            </div>
            <Button variant="primary" onClick={checkout} className="w-full">
              {user ? <ArrowRight className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {user ? "Proceed to Checkout" : "Sign in to Checkout"}
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
