import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useVerifyRedirect } from "@/api/orders";
import { Button } from "@/components/ui/Button";

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const verify = useVerifyRedirect();

  useEffect(() => {
    const body = Object.fromEntries(params.entries());
    if (!verify.isPending && !verify.isSuccess && !verify.isError) {
      verify.mutate(body);
    }
  }, []);

  const order = verify.data?.order;
  const paid = order?.paymentStatus === "SUCCESS";
  const partial = order?.paymentStatus === "PARTIAL";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center aurora grain">
      <div className="max-w-lg w-full rounded-2xl border border-line bg-surface/70 p-8 text-center space-y-5">
        {verify.isPending && (
          <>
            <Loader2 className="h-10 w-10 mx-auto text-cyan animate-spin" />
            <h1 className="font-display text-2xl font-bold text-fg">Verifying payment</h1>
            <p className="text-sm text-muted">Please wait while we verify this Pay-Panda payment with the backend.</p>
          </>
        )}
        {verify.isSuccess && (
          <>
            {paid || partial ? (
              <CheckCircle className={`h-12 w-12 mx-auto ${paid ? "text-emerald-400" : "text-cyan"}`} />
            ) : (
              <XCircle className="h-12 w-12 mx-auto text-amber-400" />
            )}
            <h1 className="font-display text-2xl font-bold text-fg">
              {paid ? "Payment verified" : partial ? "Advance received" : "Payment not completed"}
            </h1>
            <p className="text-sm text-muted">
              {partial
                ? `Order ${order?.orderNumber} is booked. The remaining ${order?.balanceDue ? `₹${order.balanceDue.toLocaleString("en-IN")}` : ""} balance is due later — pay it anytime from your Orders page.`
                : `Order ${order?.orderNumber} is currently marked as ${order?.paymentStatus}.`}
            </p>
            <Link to="/orders"><Button variant="primary">View Orders</Button></Link>
          </>
        )}
        {verify.isError && (
          <>
            <XCircle className="h-12 w-12 mx-auto text-rose-400" />
            <h1 className="font-display text-2xl font-bold text-fg">Verification failed</h1>
            <p className="text-sm text-muted">{(verify.error as Error).message}</p>
            <Link to="/orders"><Button variant="outline">Go to Orders</Button></Link>
          </>
        )}
      </div>
    </div>
  );
}
