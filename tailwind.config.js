/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#0B0E14',
          900: '#0F1420',
          800: '#161C2C',
          700: '#232B3D',
          600: '#333D54',
        },
        surface: 'var(--color-surface)',
        canvas: 'var(--color-canvas)',
        border: {
          DEFAULT: 'var(--color-border)',
          soft: 'var(--color-border-soft)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        brand: {
          50: '#EEF1FF',
          100: '#DCE2FF',
          400: '#6A82F8',
          500: '#3F5CF5',
          600: '#2C46DE',
          700: '#2337B3',
        },
        success: { 50: '#EAFAF3', 500: '#12805C', 600: '#0E6B4C' },
        warning: { 50: '#FFF6EA', 500: '#B5650A', 600: '#94530A' },
        danger: { 50: '#FDEEEC', 500: '#C0301D', 600: '#A32718' },
        neutral: { 50: '#F5F6F8', 500: '#666D7C' },
      },
      fontSize: {
        'display': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '650' }],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        toastIn: { '0%': { opacity: 0, transform: 'translateX(16px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.18s ease-out',
        slideUp: 'slideUp 0.22s ease-out',
        toastIn: 'toastIn 0.25s cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
}
