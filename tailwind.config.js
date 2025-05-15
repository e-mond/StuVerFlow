/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
      },
      colors: {
        kiwi: {
          50: "#E6F5EB", // Very light kiwi for subtle backgrounds
          100: "rgba(0, 200, 70, 0.1)", // Kept as is for transparency
          200: "#99E6B3", // Light kiwi for cards
          300: "#66D998", // Slightly darker for hover states
          400: "#33CC7D", // Medium kiwi for borders
          500: "#00BF62", // Standard kiwi for buttons
          600: "#00A653", // Darker kiwi for pressed states
          700: "#00C846", // Kept as is for primary accents
          800: "#00B63E", // Kept as is for deeper accents
          900: "#008A30", // Very dark kiwi for text or strong contrast
        },
      },
    },
  },
  plugins: [],
};
