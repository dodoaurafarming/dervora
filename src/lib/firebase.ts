import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Ganti dengan konfigurasi dari Firebase Console Anda (Sesi 1)
const firebaseConfig = {
  apiKey: "AIzaSyCHZ684fc6mx7CesBALi2hTGDgAy-QVNKg",
  authDomain: "dervora-app.firebaseapp.com",
  projectId: "dervora-app",
  storageBucket: "dervora-app.firebasestorage.app",
  messagingSenderId: "561430897117",
  appId: "1:561430897117:web:25759f6544c2c9e9289634"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Auth & Provider Google
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Opsional: Memaksa prompt pemilihan akun agar user tidak otomatis login dengan akun lama tanpa sadar
googleProvider.setCustomParameters({
  prompt: 'select_account'
});