/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:  { 900: '#0a0f1e', 800: '#0d1b2a', 700: '#112240', 600: '#1a3a6b' },
        teal:  { 400: '#2dd4bf', 500: '#00d4aa', 600: '#00b896' },
        glass: 'rgba(255,255,255,0.05)',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      backdropBlur: { xs: '4px' },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
