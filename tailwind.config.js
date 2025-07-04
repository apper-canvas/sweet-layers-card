/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        caramel: '#D4A574',
        chocolate: '#8B5A3C',
        pink: '#FFB6C1',
        cream: '#FFF8F3',
        vanilla: '#FFFBF7',
        success: '#72B01D',
        warning: '#F4B942',
        error: '#E63946',
        info: '#457B9D',
      },
      fontFamily: {
        'display': ['Fredoka One', 'cursive'],
        'body': ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'scalloped': '50% 20% 50% 20%',
      },
      boxShadow: {
        'soft': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'lift': '0 8px 16px rgba(0, 0, 0, 0.15)',
      },
      scale: {
        '102': '1.02',
      },
      animation: {
        'pulse-success': 'pulse 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}