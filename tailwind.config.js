/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        'xl': '1280px',
        '2xl': '1440px',
        'form-layout': '1150px'
      }
    },
  },
  plugins: [],
}