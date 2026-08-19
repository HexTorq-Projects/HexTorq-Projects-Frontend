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
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";
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

  // Load sidebar collapsed state from localStorage
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("hextorq-admin-sidebar-collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("hextorq-admin-sidebar-collapsed", String(next));
      } catch {
        // storage fallback
      }
      return next;
    });
  };

  const handleLogout = () => {
    clear();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-bg text-fg">
      {/* Sidebar */}
      <aside
        className={cn(
          "shrink-0 border-r border-line bg-surface flex flex-col transition-all duration-300 relative z-20",
          collapsed ? "w-[72px]" : "w-60"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-line">
          {!collapsed ? (
            <div className="flex items-center gap-2 overflow-hidden select-none">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet to-cyan text-white shadow-md font-bold text-sm shrink-0">
                HT
              </div>
              <span className="font-display text-base font-bold text-fg truncate">
                HexTorq Admin
              </span>
            </div>
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet to-cyan text-white shadow-md font-bold text-sm shrink-0">
              HT
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-bg-soft text-muted hover:text-fg hover:border-violet/40 transition-all cursor-pointer",
              collapsed ? "absolute -right-3.5 top-5 z-30 shadow-md bg-surface" : ""
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-xl text-sm font-medium transition-all group relative",
                  collapsed
                    ? "justify-center h-10 w-full px-0"
                    : "gap-3 px-3.5 py-2.5",
                  isActive
                    ? "bg-violet text-white shadow-md shadow-violet/20"
                    : "text-muted hover:bg-bg-soft hover:text-fg"
                )
              }
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}

              {/* Tooltip in collapsed mode */}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-3 hidden rounded-lg bg-surface-hi border border-line px-2.5 py-1 text-xs font-semibold text-fg shadow-xl whitespace-nowrap group-hover:block z-50">
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-line p-3">
          {!collapsed ? (
            <>
              <div className="px-3 pb-2 text-[11px] text-faint truncate font-mono">
                {admin?.email}
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-muted hover:bg-rose-500/10 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex h-10 w-full items-center justify-center rounded-xl text-muted hover:bg-rose-500/10 hover:text-rose-400 transition-colors cursor-pointer group relative"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
              <span className="pointer-events-none absolute left-full ml-3 hidden rounded-lg bg-surface-hi border border-line px-2.5 py-1 text-xs font-semibold text-rose-400 shadow-xl whitespace-nowrap group-hover:block z-50">
                Log out
              </span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-w-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
export default AdminLayout;
