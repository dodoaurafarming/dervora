/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dervora-primary': '#4A5D23', 
        'dervora-primary-dark': '#3A4A1C',
        'dervora-cream': '#F7F1E8',
        'dervora-beige': '#E5D3C8',
        'dervora-blush': '#F2E8E4',
        'dervora-dark': '#2C3E2D',
        'dervora-pink-light': '#FADCDC',
        'dervora-pink': '#F4A6A6',
        'dervora-pink-soft': '#F5DDD9',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}