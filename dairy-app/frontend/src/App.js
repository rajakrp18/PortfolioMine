// src/App.js — Root router
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage      from './pages/public/LandingPage';
import ContactPage      from './pages/public/ContactPage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import DashboardRouter  from './pages/DashboardRouter';

// Admin pages
import AdminDashboard   from './pages/admin/AdminDashboard';
import FarmerManagement from './pages/admin/FarmerManagement';
import CollectionEntry  from './pages/admin/CollectionEntry';
import ProductManagement from './pages/admin/ProductManagement';
import InventoryPage    from './pages/admin/InventoryPage';
import OrdersAdmin      from './pages/admin/OrdersAdmin';
import DeliveryAdmin    from './pages/admin/DeliveryAdmin';
import UsersAdmin       from './pages/admin/UsersAdmin';
import AnalyticsPage    from './pages/admin/AnalyticsPage';

// Farmer pages
import FarmerDashboard  from './pages/farmer/FarmerDashboard';
import FarmerCollections from './pages/farmer/FarmerCollections';
import FarmerPayments   from './pages/farmer/FarmerPayments';

// Buyer pages (wholesaler / retailer / consumer share the same shells)
import BuyerDashboard   from './pages/buyer/BuyerDashboard';
import ProductCatalog   from './pages/buyer/ProductCatalog';
import CartPage         from './pages/buyer/CartPage';
import BuyerOrders      from './pages/buyer/BuyerOrders';

// Delivery agent pages
import AgentDashboard   from './pages/agent/AgentDashboard';
import AgentDeliveries  from './pages/agent/AgentDeliveries';

// Shared layout
import Layout           from './components/Layout';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contact"  element={<ContactPage />} />
        <Route path="/"         element={<LandingPage />} />

        {/* Smart dashboard router — picks correct dashboard by role */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardRouter />} />

            {/* ── ADMIN ─────────────────────────────────────── */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin"              element={<AdminDashboard />} />
              <Route path="/admin/farmers"      element={<FarmerManagement />} />
              <Route path="/admin/collections"  element={<CollectionEntry />} />
              <Route path="/admin/products"     element={<ProductManagement />} />
              <Route path="/admin/inventory"    element={<InventoryPage />} />
              <Route path="/admin/orders"       element={<OrdersAdmin />} />
              <Route path="/admin/deliveries"   element={<DeliveryAdmin />} />
              <Route path="/admin/users"        element={<UsersAdmin />} />
              <Route path="/admin/analytics"    element={<AnalyticsPage />} />
            </Route>

            {/* ── FARMER ────────────────────────────────────── */}
            <Route element={<ProtectedRoute roles={['farmer']} />}>
              <Route path="/farmer"             element={<FarmerDashboard />} />
              <Route path="/farmer/collections" element={<FarmerCollections />} />
              <Route path="/farmer/payments"    element={<FarmerPayments />} />
            </Route>

            {/* ── BUYER (wholesaler|retailer|consumer) ──────── */}
            <Route element={<ProtectedRoute roles={['wholesaler','retailer','consumer']} />}>
              <Route path="/shop"               element={<BuyerDashboard />} />
              <Route path="/shop/products"      element={<ProductCatalog />} />
              <Route path="/shop/cart"          element={<CartPage />} />
              <Route path="/shop/orders"        element={<BuyerOrders />} />
            </Route>

            {/* ── DELIVERY AGENT ────────────────────────────── */}
            <Route element={<ProtectedRoute roles={['delivery_agent']} />}>
              <Route path="/agent"              element={<AgentDashboard />} />
              <Route path="/agent/deliveries"   element={<AgentDeliveries />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
