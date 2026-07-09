import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import { useWishlist } from "@/api/wishlist";
import { Button } from "@/components/ui/Button";
import { HoverRoll } from "@/components/motion/HoverRoll";

export function Navbar() {
  const { user, clear } = useAuthStore();
  const { openAuth, mobileNavOpen, setMobileNav } = useUiStore();
  const location = useLocation();
  const { data: wishlist = [] } = useWishlist();

  // Load preferences from localStorage or default to Dark Mode
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("hextorq-theme") || localStorage.getItem("hextroq-theme");
    if (stored) return stored === "dark";
    return true; // Default to dark mode
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("hextorq-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("hextorq-theme", "light");
    }
  }, [isDark]);

  // Elevate + tighten the bar once the page has scrolled, with a smooth
  // cross-fade (background/blur/shadow already transition globally).
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer automatically on route change.
  useEffect(() => {
    setMobileNav(false);
  }, [location.pathname]);

  const links = [
    { name: "Home", path: "/" },
    { name: "Explore Projects", path: "/explore" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const active = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-md transition-shadow duration-300 ${
        scrolled
          ? "border-line bg-bg/95 shadow-[0_8px_30px_-12px_rgba(15,17,26,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.45)]"
          : "border-line/60 bg-bg/85"
      }`}
    >
      {/* Twilight Haze hairline accent — fades in once scrolled */}
      <div
        className={`absolute inset-x-0 bottom-0 h-px bg-twilight transition-opacity duration-500 ${
          scrolled ? "opacity-60" : "opacity-0"
        }`}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center">
              <svg className="h-6 w-6 text-violet group-hover:rotate-60 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" className="text-cyan" />
              </svg>
            </div>
            <span className="font-display text-2xl tracking-tight transition-transform duration-350 flex items-center">
              <span className="font-black text-fg tracking-tighter">HEX</span>
              <span className="font-light text-gradient tracking-tight">TORQ</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`group relative px-3.5 py-2 text-sm font-medium transition-colors hover:text-cyan-txt ${
                  active(link.path) ? "text-cyan-txt" : "text-muted"
                }`}
              >
                {active(link.path) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-gradient-to-r from-violet via-indigo to-cyan rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <HoverRoll duration={380}>{link.name}</HoverRoll>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-hi border border-line text-muted hover:text-fg hover:border-violet/40 transition-all cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-indigo-500 fill-indigo-500" />
              )}
            </button>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-muted hover:text-fg transition-colors"
                >
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-surface-hi border border-line">
                    <User className="h-4 w-4 text-violet-txt" />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-bg">
                        {wishlist.length}
                      </span>
                    )}
                  </div>
                  <span>{user.name}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="h-8 w-8 rounded-full p-0"
                  title="Log Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button variant="auth" size="sm" onClick={() => openAuth("login")}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Actions/Controls */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-hi border border-line text-muted hover:text-fg transition-all cursor-pointer"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-indigo-500 fill-indigo-500" />
              )}
            </button>

            {user && (
              <Link
                to="/dashboard"
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-surface-hi border border-line"
              >
                <User className="h-4 w-4 text-violet-txt" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-bg">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileNav(!mobileNavOpen)}
              className="text-muted hover:text-fg focus:outline-none"
            >
              {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-line bg-bg-soft"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileNav(false)}
                    className={`block text-base font-medium py-2.5 transition-colors ${
                      active(link.path) ? "text-cyan-txt" : "text-muted hover:text-fg"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 mt-2 border-t border-line flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileNav(false)}
                      className="flex items-center gap-3 text-base font-medium py-2 text-muted hover:text-fg transition-colors"
                    >
                      <User className="h-5 w-5 text-violet-txt" />
                      <span>My Dashboard</span>
                      {wishlist.length > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        clear();
                        setMobileNav(false);
                      }}
                      className="w-full"
                    >
                      Log Out
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="auth"
                    onClick={() => {
                      setMobileNav(false);
                      openAuth("login");
                    }}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
export default Navbar;
