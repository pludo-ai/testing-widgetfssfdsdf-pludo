/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './widget.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(45, 93%, 95%)',
          100: 'hsl(45, 93%, 90%)',
          200: 'hsl(45, 93%, 80%)',
          300: 'hsl(45, 93%, 70%)',
          400: 'hsl(45, 93%, 60%)',
          500: '#eab308',
          600: 'hsl(45, 93%, 40%)',
          700: 'hsl(45, 93%, 30%)',
          800: 'hsl(45, 93%, 20%)',
          900: 'hsl(45, 93%, 10%)',
        },
      },
    },
  },
  plugins: [],
};