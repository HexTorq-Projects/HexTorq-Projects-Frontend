import { Users, FolderKanban, ShoppingBag, IndianRupee, Percent, MessageSquare } from "lucide-react";
import { useAdminStats } from "@/api/admin";
import { Spinner } from "@/components/ui/Spinner";

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet/10 text-violet">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm text-muted">{label}</span>
      </div>
      <div className="text-2xl font-bold text-fg">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useAdminStats();

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fg mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Users" value={data.userCount} />
        <StatCard icon={FolderKanban} label="Total Projects" value={data.projectCount} />
        <StatCard icon={IndianRupee} label="Revenue (paid orders)" value={`₹${data.totalRevenue.toLocaleString("en-IN")}`} />
        <StatCard icon={Percent} label="Active Offers" value={data.activeOfferCount} />
        <StatCard icon={MessageSquare} label="New Enquiries" value={data.newEnquiryCount} />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={Object.values(data.orderStatusCounts).reduce((a, b) => a + b, 0)}
        />
      </div>

      {Object.keys(data.orderStatusCounts).length > 0 && (
        <div className="mt-6 rounded-xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-fg mb-3">Orders by status</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(data.orderStatusCounts).map(([status, count]) => (
              <div key={status} className="rounded-lg bg-bg-soft border border-line px-3 py-2 text-xs">
                <span className="text-muted">{status}</span>{" "}
                <span className="font-semibold text-fg">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
