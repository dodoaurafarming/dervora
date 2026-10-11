import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/home/HomePage';
import { ProductsPage } from './pages/products/ProductsPage';
import { ProductDetailPage } from './pages/product-detail/ProductDetailPage';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

// ==================== PUBLIC LAYOUT ====================
// Layout untuk halaman publik (dengan Navbar, Footer, BottomNav)
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

// ==================== DUMMY PAGES ====================
const IngredientsPage = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-dervora-primary">Ingredients Page</h1>
  </div>
);
const RoutinePage = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-dervora-primary">My Routine Page</h1>
  </div>
);
const ProfilePage = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-dervora-primary">Profile Page</h1>
  </div>
);

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/my-routine" element={<RoutinePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* ==================== ADMIN ROUTES ==================== */}
        {/* Admin page TIDAK pakai PublicLayout */}
        <Route path="/dervora-control-9k2x/login" element={<LoginPage />} />
        <Route
          path="/dervora-control-9k2x/dashboard"
          element={
            <AdminProtectedRoute>
              <DashboardPage />
            </AdminProtectedRoute>
          }
        />

        {/* ==================== FALLBACK ==================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;