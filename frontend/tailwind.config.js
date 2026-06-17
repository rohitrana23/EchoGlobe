/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neo: { bg: '#fdf6e3', yellow: '#ffde59', pink: '#ff914d', blue: '#5ce1e6', dark: '#1e1e1e' }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
      }
    },
  },
  plugins: [],
}