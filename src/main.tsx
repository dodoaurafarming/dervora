import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Redirect otomatis: jika URL tidak mengandung hash, arahkan ke #/
// Ini menyelesaikan masalah "Home page kosong di URL root"
if (!window.location.hash) {
  window.location.hash = '#/';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);