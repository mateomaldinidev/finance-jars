/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        headline: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        label: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#0e0e0e',
        card: '#191a1a',
        cardHigh: '#1f2020',
        cardHighest: '#252626',
        border: '#484848',
        text: '#e7e5e4',
        muted: '#acabaa',
        accent: '#04dcff',
        success: '#9bffce',
        danger: '#ee7d77',
      },
      borderRadius: {
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      boxShadow: {
        float: '0 20px 40px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
