/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#EAF4F1',
          100: '#CBE4DC',
          200: '#9CCAB9',
          300: '#6DAF97',
          400: '#3E9575',
          500: '#1D7A5C',
          600: '#0F5C4B',
          700: '#0C4A3D',
          800: '#09382F',
          900: '#0A1F1A',
        },
        gold: {
          50: '#FBF6EB',
          100: '#F3E6C4',
          200: '#ECD6A0',
          300: '#E1C078',
          400: '#D5AE5E',
          500: '#C9A24B',
          600: '#B0873A',
          700: '#8C6B2E',
          800: '#684F22',
          900: '#453516',
        },
        sand: {
          50: '#F8F6F0',
          100: '#F1EDE3',
          200: '#E5DFCF',
        },
        sage: {
          400: '#8AA69D',
          500: '#5F7A72',
          600: '#465A54',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
}
