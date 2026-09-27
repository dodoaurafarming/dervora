import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/home/HomePage';
import { ProductsPage } from './pages/products/ProductsPage';
import { ProductDetailPage } from './pages/product-detail/ProductDetailPage';

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
            {/* Fallback: redirect ke Home kalau route tidak dikenal */}
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