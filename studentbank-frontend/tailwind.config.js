/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          navy: '#0A192F',
          darkBlue: '#0F2744',
          royal: '#2563EB',
          royalHover: '#1D4ED8',
          teal: '#0D9488',
          tealHover: '#0F766E',
          accent: '#06B6D4',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'fintech': '0 4px 20px -2px rgba(10, 25, 47, 0.06), 0 2px 6px -1px rgba(10, 25, 47, 0.04)',
        'fintech-lg': '0 10px 25px -3px rgba(10, 25, 47, 0.08), 0 4px 10px -2px rgba(10, 25, 47, 0.05)',
      }
    },
  },
  plugins: [],
}
