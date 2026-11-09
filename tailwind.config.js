/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e5ebe5',
          200: '#cbd7cb',
          300: '#a6bea6',
          400: '#7e9f7e',
          500: '#5c805c',
          600: '#476547',
          700: '#395039',
          800: '#304130',
          900: '#293729',
        },
        earth: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#846356',
          800: '#6c4f44',
          900: '#583f36',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(16, 56, 42, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 25px -5px rgba(16, 56, 42, 0.1), 0 8px 10px -6px rgba(16, 56, 42, 0.06)',
      }
    },
  },
  plugins: [],
}
