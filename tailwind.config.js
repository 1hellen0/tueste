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
        },
        aura: {
          bg: '#17120F',          // Fondo principal: espresso oscuro
          bgDeep: '#0F0C0A',      // Fondo espresso ultra profundo para contrastes e insignias
          surface: '#241B16',     // Superficies: chocolate profundo
          card: '#30231C',        // Tarjetas: marrón oscuro
          cardHover: '#3d2c23',
          cardLight: '#3D2D24',   // Tarjetas secundarias e ítems de lista
          cardDeep: '#231813',    // Fondo profundo para marcos de imágenes
          border: '#74513D',      // Bordes: cobre suave
          borderLight: '#8d634b',
          gold: '#D4A35A',        // Acentos principales: dorado
          goldLight: '#e2b572',
          goldGlow: '#F3C785',    // Brillo dorado luminoso
          copper: '#B87950',      // Acentos secundarios: cobre
          copperBright: '#c98a63',
          copperGlow: '#D4895C',  // Brillo cobrizo
          cream: '#F2E6D6',       // Texto principal: crema cálido de alto contraste
          beige: '#B9A899',       // Texto secundario: beige cálido
          textMuted: '#C4B5A5',   // Texto atenuado legible (contraste WCAG AA sobre espresso)
          darkMuted: '#A8998A',   // Texto sutil para escalas de sliders y leyendas
          wood: '#2c2018',
          woodLight: '#3D2C22',   // Hover para botones de madera
          woodHeader: '#2a1e17',
          bronze: '#7A4F38',      // Tono bronce para gradientes
          burgundy: '#6B231C',    // Tono borgoña tostado para hitos de caja
          green: '#2E7D32',       // Tono verde tostado para estado saludable y M1
        },
        roastify: {
          cream: '#F3EDE4',        // Crema claro: #F3EDE4
          chocolate: '#482B23',    // Chocolate: #482B23
          chocolateDark: '#382019',
          forest: '#25432F',       // Verde bosque: #25432F
          forestDark: '#1c3324',
          gold: '#F5B700',         // Amarillo dorado: #F5B700
          goldHover: '#e0a700',
          beige: '#DED3C5',        // Beige: #DED3C5
          dark: '#30231C',         // Texto oscuro: #30231C
          darkMuted: '#665348',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Cinzel', 'Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
