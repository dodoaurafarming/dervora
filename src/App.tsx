import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

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

import { AboutPage } from './pages/static/AboutPage';
import { ContactPage } from './pages/static/ContactPage';
import { PrivacyPage } from './pages/static/PrivacyPage';
import { FeedbackPage } from './pages/static/FeedbackPage';

import { ProfilePage } from './pages/profile/ProfilePage';
import { SettingsPage } from './pages/profile/SettingsPage';

import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/ingredients/:id" element={<IngredientDetailPage />} />
            <Route path="/my-routine" element={<RoutinePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/skin-profile" element={<SkinProfilePage />} />
            <Route path="/matches" element={<ProductMatchesPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
          </Route>

          <Route
            path="/dervora-control-9k2x"
            element={<Navigate to="/dervora-control-9k2x/dashboard" replace />}
          />
          <Route path="/dervora-control-9k2x/login" element={<LoginPage />} />

          <Route
            path="/dervora-control-9k2x/dashboard"
            element={
              <AdminProtectedRoute>
                <DashboardPage />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/dervora-control-9k2x/ingredients"
            element={
              <AdminProtectedRoute>
                <AdminIngredientsPage />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/dervora-control-9k2x/catalog"
            element={
              <AdminProtectedRoute>
                <AdminCatalogPage />
              </AdminProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;