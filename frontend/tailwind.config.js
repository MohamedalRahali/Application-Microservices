/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#f97316',
          red: '#ef4444',
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(to right, #f97316, #ef4444)',
      }
    },
  },
  plugins: [],
};
