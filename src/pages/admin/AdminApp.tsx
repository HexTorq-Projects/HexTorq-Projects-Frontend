import { Routes, Route } from "react-router-dom";
import { AdminRoute } from "./AdminRoute";
import { AdminLayout } from "./AdminLayout";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";
import AdminProjects from "./AdminProjects";
import AdminCollections from "./AdminCollections";
import AdminOrders from "./AdminOrders";
import AdminEnquiries from "./AdminEnquiries";
import AdminWishlist from "./AdminWishlist";
import AdminOffers from "./AdminOffers";

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="wishlist" element={<AdminWishlist />} />
          <Route path="offers" element={<AdminOffers />} />
        </Route>
      </Route>
    </Routes>
  );
}
