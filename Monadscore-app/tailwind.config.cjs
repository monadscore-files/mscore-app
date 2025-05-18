/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        metavers: ['Metavers', 'sans-serif'], // Add your font family here
        proxima: ['Proxima', 'sans-serif'], // Add your font family here
      },
    },
  },
  plugins: [],
}


