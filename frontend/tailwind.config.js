/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#423E3E',
          dark: '#173421',
          light: '#FFF6ED',
        },
        secondary: {
          DEFAULT: '#173421',
          light: '#C1AE91',
        },
        accent: '#DC7644',
        beige: {
          light: '#FFF6ED',
          DEFAULT: '#F5E4C4',
          dark: '#E6D5C1',
        }
      },
      fontFamily: {
        display: ['Swear Display', 'Georgia', 'serif'],
        body: [
          'Helvetica Neue',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      backgroundColor: {
        base: '#F5E4C4',
      },
      backgroundImage: {
        'beige-gradient': 'linear-gradient(to bottom, #FFF6ED, #F5E4C4)',
      }
    },
  },
  plugins: [],
};