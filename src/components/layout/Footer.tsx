import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Music } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
     <footer className="w-full bg-dervora-blush/30 border-t border-dervora-beige">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pt-12 md:pt-16 pb-28 md:pb-16">
        {/* Grid 4 kolom */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Kolom 1 — Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img src="${import.meta.env.BASE_URL}images/logo-icon.png" alt="Dervora" className="w-10 h-10 object-contain" />
              <span className="font-heading text-2xl font-bold text-dervora-primary">
                Dervora
              </span>
            </Link>
            <p className="font-body text-base text-dervora-dark/80 max-w-xs leading-relaxed">
              Your personal skincare companion. Know your skin, find your match, love your routine.
            </p>
          </div>
          
          {/* Kolom 2 — Fitur */}
          <div>
            <h3 className="font-heading text-lg font-bold text-dervora-primary mb-5">
              Fitur
            </h3>
            <ul className="space-y-3 font-body text-base text-dervora-dark/80">
              <li><Link to="/quiz" className="hover:text-dervora-primary transition-colors">Skin Quiz</Link></li>
              <li><Link to="/matches" className="hover:text-dervora-primary transition-colors">Find Your Match</Link></li>
              <li><Link to="/ingredients" className="hover:text-dervora-primary transition-colors">Ingredient Checker</Link></li>
              <li><Link to="/my-routine" className="hover:text-dervora-primary transition-colors">My Routine</Link></li>
            </ul>
          </div>
          
          {/* Kolom 3 — Info */}
          <div>
            <h3 className="font-heading text-lg font-bold text-dervora-primary mb-5">
              Info
            </h3>
            <ul className="space-y-3 font-body text-base text-dervora-dark/80">
              <li><Link to="/products" className="hover:text-dervora-primary transition-colors">Produk</Link></li>
              <li><Link to="/journal" className="hover:text-dervora-primary transition-colors">Journal</Link></li>
              <li><Link to="/about" className="hover:text-dervora-primary transition-colors">Tentang Kami</Link></li>
              <li><Link to="/contact" className="hover:text-dervora-primary transition-colors">Kontak</Link></li>
            </ul>
          </div>
          
          {/* Kolom 4 — Connect */}
          <div>
            <h3 className="font-heading text-lg font-bold text-dervora-primary mb-5">
              Connect
            </h3>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="w-11 h-11 rounded-full bg-dervora-primary/15 flex items-center justify-center hover:bg-dervora-primary hover:text-dervora-cream transition-all">
                {/* SVG Manual untuk Instagram */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" aria-label="TikTok" className="w-11 h-11 rounded-full bg-dervora-primary/15 flex items-center justify-center hover:bg-dervora-primary hover:text-dervora-cream transition-all">
                <Music size={18} />
              </a>
              <a href="#" aria-label="Email" className="w-11 h-11 rounded-full bg-dervora-primary/15 flex items-center justify-center hover:bg-dervora-primary hover:text-dervora-cream transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-dervora-beige mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-dervora-dark/70 text-center md:text-left">
            © 2026 Dervora. All rights reserved.
          </p>
          <p className="font-heading italic text-base text-dervora-dark/80 text-center md:text-right">
            Made with ♡ for your skin's journey.
          </p>
        </div>
      </div>
    </footer>
  );
};