import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/home/HomePage';
import { ProductsPage } from './pages/products/ProductsPage';
import { ProductDetailPage } from './pages/product-detail/ProductDetailPage';
import { IngredientsPage } from './pages/ingredients/IngredientsPage';
import { IngredientDetailPage } from './pages/ingredient-detail/IngredientDetailPage';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { RoutinePage } from './pages/my-routine/RoutinePage';
import { QuizPage } from './pages/quiz/QuizPage';
import { SkinProfilePage } from './pages/skin-profile/SkinProfilePage';
import { ProductMatchesPage } from './pages/product-matches/ProductMatchesPage';
import { AdminIngredientsPage } from './pages/admin/AdminIngredientsPage';
import { AdminCatalogPage } from './pages/admin/AdminCatalogPage';

// IMPORT HALAMAN STATIS BARU
import { AboutPage } from './pages/static/AboutPage';
import { ContactPage } from './pages/static/ContactPage';
import { PrivacyPage } from './pages/static/PrivacyPage';
import { FeedbackPage } from './pages/static/FeedbackPage';

// IMPORT HALAMAN PROFIL & PENGATURAN
import { ProfilePage } from './pages/profile/ProfilePage';
import { SettingsPage } from './pages/profile/SettingsPage';

import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

// ==================== PUBLIC LAYOUT ====================
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
          <Route path="/ingredients/:id" element={<IngredientDetailPage />} />
          <Route path="/my-routine" element={<RoutinePage />} />
          
          {/* Rute Profil & Settings */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          <Route path="/skin-profile" element={<SkinProfilePage />} />
          <Route path="/matches" element={<ProductMatchesPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          
          {/* RUTE HALAMAN STATIS BARU */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Route>

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route path="/dervora-control-9k2x/login" element={<LoginPage />} />
        
        <Route
          path="/dervora-control-9k2x/dashboard"
          element={
            <AdminProtectedRoute>
              <DashboardPage />
            </AdminProtectedRoute>
          }
        />

        {/* Menu Admin Ingredients (Tabel lama) */}
        <Route
          path="/dervora-control-9k2x/ingredients"
          element={
            <AdminProtectedRoute>
              <AdminIngredientsPage />
            </AdminProtectedRoute>
          }
        />

        {/* Menu Admin Catalog (Tabel baru yang rapi) */}
        <Route
          path="/dervora-control-9k2x/catalog"
          element={
            <AdminProtectedRoute>
              <AdminCatalogPage />
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