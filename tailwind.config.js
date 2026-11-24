/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fff5f7',
          100: '#fde8ec',
          200: '#fcd3db',
          300: '#f8aebc',
          400: '#f07b92',
          500: '#e04c6a',
          600: '#c52c4c',
          700: '#a31d38',
          800: '#881b31',
          900: '#721a2d',
          950: '#400814',
          DEFAULT: '#800020',
          deep: '#5a0618',
          dark: '#3d0410',
          blush: '#fff8fa',
          border: '#ebd4d9',
          lightBorder: '#f3e3e6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(128, 0, 32, 0.04), 0 4px 6px -2px rgba(128, 0, 32, 0.02)',
        'card': '0 4px 20px -2px rgba(128, 0, 32, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 25px -5px rgba(128, 0, 32, 0.08), 0 8px 10px -6px rgba(128, 0, 32, 0.04)',
      }
    },
  },
  plugins: [],
}
