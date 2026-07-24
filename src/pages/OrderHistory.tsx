import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PackageCheck, RefreshCw, Wallet } from "lucide-react";
import { useOrders, useVerifyOrder, usePayBalance } from "@/api/orders";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatINR } from "@/lib/format";

function badgeColor(paymentStatus: string) {
  if (paymentStatus === "SUCCESS") return "#10b981";
  if (paymentStatus === "PARTIAL") return "#3b82f6";
  if (paymentStatus === "FAILED") return "#ef4444";
  return "#f59e0b";
}

export default function OrderHistory() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: orders = [], isLoading } = useOrders();
  const verify = useVerifyOrder();
  const payBalance = usePayBalance();

  useEffect(() => {
    if (!user) navigate(`/login?redirect=${encodeURIComponent("/orders")}`);
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto aurora grain">
      <div className="mb-8 border-b border-line pb-6">
        <h1 className="font-display text-3xl font-bold text-fg flex items-center gap-3">
          <PackageCheck className="h-7 w-7 text-cyan" />
          Order History
        </h1>
        <p className="text-sm text-muted mt-1">Track Pay-Panda checkout and verification status for purchased projects.</p>
      </div>

      {isLoading ? (
        <div className="h-40 rounded-2xl border border-line bg-surface/40 animate-pulse" />
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface/30 py-16 text-center">
          <h2 className="font-display text-xl font-semibold text-fg">No orders yet</h2>
          <p className="text-sm text-muted mt-1 mb-6">Checkout from your cart to create the first order.</p>
          <Link to="/explore"><Button variant="primary">Explore Projects</Button></Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="glass rounded-2xl border border-line p-6 space-y-5 hover:border-violet/30 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-fg tracking-wider bg-surface-hi border border-line px-2.5 py-1 rounded-lg">
                      {order.orderNumber}
                    </span>
                    <Badge color={badgeColor(order.paymentStatus)}>
                      {order.status === "BOOKED" ? "PARTIAL PAID (BOOKED)" : order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-faint pt-1">
                    <span>Date: <strong className="text-muted">{formatDate(order.rowCreatedTime)}</strong></span>
                    <span>•</span>
                    <span>Items: <strong className="text-muted">{order.items.length} package(s)</strong></span>
                    {order.customerEmail && (
                      <>
                        <span>•</span>
                        <span>Billing: <strong className="text-muted">{order.customerEmail}</strong></span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="text-right">
                    <span className="block font-display text-2xl font-black text-fg">{formatINR(order.totalAmount)}</span>
                    {order.status === "BOOKED" && order.balanceDue > 0 && (
                      <span className="text-xs text-rose-400 font-semibold">
                        Balance due: {formatINR(order.balanceDue)}
                      </span>
                    )}
                  </div>

                  {order.status === "BOOKED" && order.balanceDue > 0 && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        payBalance.mutate(order.id, { onSuccess: (data) => (window.location.href = data.checkoutUrl) })
                      }
                      disabled={payBalance.isPending}
                      className="shadow-md shadow-violet-500/20"
                    >
                      <Wallet className="h-4 w-4" />
                      Pay Due {formatINR(order.balanceDue)}
                    </Button>
                  )}

                  {order.checkoutUrl && order.paymentStatus !== "SUCCESS" && order.paymentStatus !== "PARTIAL" && (
                    <a href={order.checkoutUrl} target="_blank" rel="noreferrer">
                      <Button variant="primary" size="sm">Pay Now</Button>
                    </a>
                  )}

                  {order.paymentStatus !== "SUCCESS" && order.paymentStatus !== "PARTIAL" && (
                    <Button variant="outline" size="sm" onClick={() => verify.mutate(order.id)} disabled={verify.isPending}>
                      <RefreshCw className={`h-4 w-4 ${verify.isPending ? "animate-spin" : ""}`} />
                      Re-Verify Status
                    </Button>
                  )}
                </div>
              </div>

              {/* Items Grid */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-faint uppercase tracking-wider">Purchased Packages</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.items.map((item) => (
                    <Link
                      key={item.id}
                      to={`/project/${item.projectId}`}
                      className="flex items-center justify-between gap-3 text-sm text-fg bg-surface/50 border border-line/60 rounded-xl px-4 py-3 hover:border-violet/40 hover:bg-surface-hi transition-all group"
                    >
                      <span className="font-semibold line-clamp-1 group-hover:text-cyan transition-colors">{item.projectTitleSnapshot}</span>
                      <span className="text-xs font-bold text-muted shrink-0">{formatINR(item.unitPrice)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
