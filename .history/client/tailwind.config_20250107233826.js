/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure all React files are scanned
    "./public/index.html",         // Include index.html if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
