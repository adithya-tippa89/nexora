/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B132B',
          navy: '#1C2541',
          primary: '#1E3A8A',
          blue: '#2563EB',
          sky: '#38BDF8',
          accent: '#6366F1',
          teal: '#0D9488',
          cyan: '#06B6D4',
          emerald: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          surface: '#FFFFFF',
          bg: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
