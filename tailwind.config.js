/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF8',
        surface: '#FFFFFF',
        ink: '#191718',
        muted: '#706B6E',
        border: '#E8E4E6',
        brand: {
          DEFAULT: '#9D2567',
          dark: '#592049',
          soft: '#F8EDF3',
        },
        success: '#227A52',
        warning: '#B77818',
        error: '#B83A42',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '12px',
        control: '9px',
      },
      maxWidth: {
        app: '430px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(25, 23, 24, 0.04)',
      },
    },
  },
  plugins: [],
}
