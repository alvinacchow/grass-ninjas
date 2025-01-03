/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        bounce: 'bounce 0.3s ease-in-out', 
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'scale(1)' },  
          '50%': { transform: 'scale(1.2)' },       
        },
      },
    },
  },
  plugins: [],
  
};
