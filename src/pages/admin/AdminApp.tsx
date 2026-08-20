import { Routes, Route } from "react-router-dom";
import { AdminRoute } from "./AdminRoute";
import { AdminLayout } from "./AdminLayout";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminDeliveryBoard from "./AdminDeliveryBoard";
import AdminOrders from "./AdminOrders";
import AdminProjects from "./AdminProjects";
import AdminCollections from "./AdminCollections";
import AdminServices from "./AdminServices";
import AdminCalendar from "./AdminCalendar";
import AdminTickets from "./AdminTickets";
import AdminUsers from "./AdminUsers";
import AdminStaff from "./AdminStaff";
import AdminEnquiries from "./AdminEnquiries";
import AdminWishlist from "./AdminWishlist";
import AdminOffers from "./AdminOffers";
import AdminReferrals from "./AdminReferrals";
import AdminSettings from "./AdminSettings";

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="delivery" element={<AdminDeliveryBoard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="calendar" element={<AdminCalendar />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="wishlist" element={<AdminWishlist />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="referrals" element={<AdminReferrals />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
