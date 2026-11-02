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
          950: '#04120c',
          900: '#0a2318',
          850: '#0e3122',
          800: '#14412e',
          700: '#1d573e',
          600: '#277453',
          500: '#34936a',
          400: '#48b485',
        },
        coffee: {
          950: '#150d0a',
          900: '#231511',
          850: '#2d1b15',
          800: '#3e261e',
          700: '#56352a',
          600: '#75483a',
          500: '#945e4d',
          400: '#b47864',
          300: '#d29b89',
        },
        cream: {
          50: '#fefdfb',
          100: '#fcf8f0',
          200: '#f6eedc',
          300: '#ece0c4',
          400: '#ddcaa3',
          500: '#c7b084',
          600: '#a89066',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
