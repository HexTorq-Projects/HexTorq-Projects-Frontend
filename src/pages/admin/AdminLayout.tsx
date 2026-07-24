import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Tags,
  ShoppingBag,
  MessageSquare,
  Heart,
  Percent,
  Gift,
  LogOut,
} from "lucide-react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/collections", label: "Collections", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { to: "/admin/wishlist", label: "Wishlist", icon: Heart },
  { to: "/admin/offers", label: "Offers", icon: Percent },
  { to: "/admin/referrals", label: "Referrals", icon: Gift },
];

export function AdminLayout() {
  const { admin, clear } = useAdminAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clear();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-bg text-fg">
      <aside className="w-60 shrink-0 border-r border-line bg-surface flex flex-col">
        <div className="px-5 py-5 border-b border-line">
          <span className="font-display text-lg font-bold">HexTorq Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-violet/10 text-violet" : "text-muted hover:bg-bg-soft hover:text-fg"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line px-3 py-4">
          <div className="px-3 pb-2 text-xs text-faint truncate">{admin?.email}</div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-bg-soft hover:text-fg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
