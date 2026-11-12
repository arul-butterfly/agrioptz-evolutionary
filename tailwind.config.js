/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14532D',
          dark: '#0F3E22',
          light: '#166534',
        },
        accent: {
          DEFAULT: '#22C55E',
          hover: '#16A34A',
          light: '#DCFCE7',
          subtle: '#F0FDF4',
        },
        surface: {
          bg: '#F8FAF7',
          card: '#FFFFFF',
          border: '#E5E7EB',
          subtle: '#F3F4F6'
        },
        text: {
          main: '#1F2937',
          muted: '#6B7280',
          heading: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
