import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/home/HomePage';
import { ProductsPage } from './pages/products/ProductsPage';
import { ProductDetailPage } from './pages/product-detail/ProductDetailPage';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

// Halaman dummy untuk testing
const IngredientsPage = () => <div className="p-4"><h1 className="text-2xl font-bold text-dervora-primary">Ingredients Page</h1></div>;
const RoutinePage = () => <div className="p-4"><h1 className="text-2xl font-bold text-dervora-primary">My Routine Page</h1></div>;
const ProfilePage = () => <div className="p-4"><h1 className="text-2xl font-bold text-dervora-primary">Profile Page</h1></div>;

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/my-routine" element={<RoutinePage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin Routes (Hidden) */}
            <Route path="/dervora-control-9k2x/login" element={<LoginPage />} />
            <Route
              path="/dervora-control-9k2x/dashboard"
              element={
                <AdminProtectedRoute>
                  <div className="p-8">
                    <h1 className="font-heading text-3xl font-bold text-dervora-primary">
                      Dashboard - Coming Soon
                    </h1>
                    <p className="font-body text-dervora-dark/70 mt-2">
                      Tabel produk akan dibangun di Sprint B4.3.
                    </p>
                  </div>
                </AdminProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <BottomNav />
      </div>
    </Router>
  );
};

export default App;