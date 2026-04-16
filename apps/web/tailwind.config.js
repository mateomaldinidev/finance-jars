/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0f19',
        card: '#121826',
        border: '#2a3142',
        text: '#e5e7eb',
        muted: '#94a3b8',
        accent: '#38bdf8',
      },
    },
  },
  plugins: [],
}
