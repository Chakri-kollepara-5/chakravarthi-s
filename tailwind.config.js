/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dandy: {
          50: '#FFFAF0',
          100: '#FFF3DC',
          200: '#FDDCA8', // Warm peach swatch base
          300: '#F7C97E', // Deeper golden peach
          400: '#D4A76A', // Sandy amber
          500: '#C08B3E', // Burnished gold
          600: '#9B6B1A', // Deep amber
          700: '#7A5316', // Rich brown-gold
          800: '#5C3D10', // Dark warm brown
          900: '#3A2408', // Deep warm charcoal-brown
          950: '#1C1108', // Near-black warm brown
        },
        peach: {
          50: '#FFFAF0',
          100: '#FFF3DC',
          200: '#FDDCA8',
          300: '#F7C97E',
          400: '#D4A76A',
          500: '#C08B3E',
          600: '#9B6B1A',
          700: '#7A5316',
          800: '#5C3D10',
          900: '#3A2408',
          950: '#1C1108',
        },
        apeblue: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#0A4DFF',
          800: '#0033FF',
          900: '#0022cc',
          950: '#001166',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Anton', 'sans-serif'],
      },
      backgroundImage: {
        'dandy-gradient': 'radial-gradient(circle at 50% 50%, #FFFAF0 0%, #FDDCA8 50%, #F7C97E 100%)',
        'peach-gradient': 'radial-gradient(circle at 50% 50%, #FFFAF0 0%, #FDDCA8 50%, #F7C97E 100%)',
        'ape-gradient': 'linear-gradient(135deg, #C08B3E 0%, #9B6B1A 50%, #3A2408 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255,250,240,0.15) 0%, rgba(255,250,240,0) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: .7, filter: 'brightness(1.5)' },
        }
      }
    },
  },
  plugins: [],
};
