import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        favorit: ['"Favorit"', 'Arial', 'sans-serif'],
        gaisyr: ['"Gaisyr"', 'Arial', 'sans-serif'],
        holla: ['"Holla"', 'serif'],
      },
      colors: {
        // Base colors
        primary: {
          DEFAULT: "#FFFFFF", // White
          dark: "#000000",   // Black
        },
        secondary: {
          DEFAULT: "#1A1A1A", // Dark gray
          light: "#2A2A2A",   // Lighter dark gray
        },
        accent: {
          DEFAULT: "#666666", // Medium gray
          light: "#999999",   // Light gray
          dark: "#333333",    // Dark gray
        },
        // State colors
        disabled: "#4A4A4A",  // Disabled state gray
        hover: "#3A3A3A",     // Hover state gray
        active: "#2A2A2A",    // Active state gray
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
