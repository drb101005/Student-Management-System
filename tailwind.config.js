/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'Segoe UI', 'sans-serif'],
        body: ['DM Sans', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        panel: '0 25px 60px -30px rgba(15, 23, 42, 0.55)'
      },
      colors: {
        brand: {
          ink: '#0f172a',
          mist: '#e2e8f0',
          gold: '#f59e0b',
          teal: '#0f766e',
          coral: '#f97316'
        }
      }
    }
  },
  plugins: []
};

