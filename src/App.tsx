import { useLayoutEffect, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AuthModal } from "./components/modals/AuthModal";
import { EnquiryModal } from "./components/modals/EnquiryModal";
import { useRotatingTitle } from "./hooks/useRotatingTitle";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import CategoryPage from "./pages/CategoryPage";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import OrderHistory from "./pages/OrderHistory";
import PaymentCallback from "./pages/PaymentCallback";
import AdminApp from "./pages/admin/AdminApp";

/** Cross-fades route content on navigation and resets scroll, so opening a
 *  project (or any page) never feels like an abrupt jump-cut. */
function AnimatedRoutes() {
  const location = useLocation();
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const routes = (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/category/:name" element={<CategoryPage />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/payment/callback" element={<PaymentCallback />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );

  if (reduced) return routes;

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {routes}
      </motion.div>
    </AnimatePresence>
  );
}

function RouteProgressBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(15);
    
    const t1 = setTimeout(() => setProgress(35), 80);
    const t2 = setTimeout(() => setProgress(65), 180);
    const t3 = setTimeout(() => setProgress(85), 320);

    const tComplete = setTimeout(() => {
      setProgress(100);
      const tFade = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(tFade);
    }, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tComplete);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-violet-txt to-cyan-txt z-[9999] transition-all duration-300 ease-out"
      style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
    />
  );
}

export function App() {
  useRotatingTitle();
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <RouteProgressBar />
      <Navbar />
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      <Footer />
      <AuthModal />
      <EnquiryModal />
    </div>
  );
}
export default App;
