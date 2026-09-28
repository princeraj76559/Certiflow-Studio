/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#090d16',
          900: '#0f172a',
          850: '#131b2e',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        brand: {
          cyan: '#06b6d4',
          mint: '#10b981',
          teal: '#14b8a6',
          amber: '#f59e0b',
          purple: '#8b5cf6',
          pink: '#ec4899',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        greatvibes: ['"Great Vibes"', 'cursive'],
        alexbrush: ['"Alex Brush"', 'cursive'],
        playfair: ['"Playfair Display"', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        dancing: ['"Dancing Script"', 'cursive'],
        pinyon: ['"Pinyon Script"', 'cursive']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.4)',
        'glow-mint': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
        'glow-amber': '0 0 20px -5px rgba(245, 158, 11, 0.4)',
        'glow-purple': '0 0 20px -5px rgba(139, 92, 246, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
