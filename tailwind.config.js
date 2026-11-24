/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F3EE',
        line: '#E4E0D6',
        ink: { DEFAULT: '#17181C', soft: '#3A3B41', muted: '#6E6C66', faint: '#9C9A93' },
        night: { DEFAULT: '#14161B', 2: '#1C1F26', 3: '#262A33', line: '#2C303A' },
        brand: { DEFAULT: '#2E4BD6', dark: '#2339A8', soft: '#ECEFFC', ring: '#B9C4F4' },
        good: { DEFAULT: '#17784C', soft: '#E7F4EC' },
        bad: { DEFAULT: '#C2392C', soft: '#FBEBE8' },
        warn: { DEFAULT: '#A86A12', soft: '#FAF1DF' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23,24,28,0.04), 0 1px 1px rgba(23,24,28,0.03)',
        lift: '0 8px 24px -8px rgba(23,24,28,0.14), 0 2px 6px -2px rgba(23,24,28,0.06)',
      },
    },
  },
  plugins: [],
};
