import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/home/HomePage';
import { ProductsPage } from './pages/products/ProductsPage';
import { ProductDetailPage } from './pages/product-detail/ProductDetailPage';

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
            {/* Rute halaman lain ditambahkan di sini */}
          </Routes>
        </main>

        <Footer />
        <BottomNav />
      </div>
    </Router>
  );
};

export default App;