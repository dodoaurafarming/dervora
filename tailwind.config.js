/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dervora-primary': '#214F3A',
        'dervora-primary-dark': '#1a3d2e',
        'dervora-cream': '#F7F1E8',
        'dervora-beige': '#EDE5D8',
        'dervora-blush': '#E8C7C0',
        'dervora-pink-light': '#FADCDC',
        'dervora-pink': '#F4A6A6',
        'dervora-pink-bright': '#F8C8C8',
        'dervora-dark': '#1F2521',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'dervora': '0 2px 8px rgba(31, 37, 33, 0.08)',
      },
    },
  },
  plugins: [],
}