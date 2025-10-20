/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        primary: '#1E1E1E',
        accent: '#00E5FF',
        'text-main': '#F5F5F5',
        'text-secondary': '#A0A0A0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        aurora: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
            opacity: '0.4',
          },
          '50%': {
            transform: 'translateY(-8px)',
            opacity: '1',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
      },
      animation: {
        aurora: 'aurora 20s ease infinite',
        bounce: 'bounce 1.4s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out',
        slideInRight: 'slideInRight 0.4s ease-out',
        slideInLeft: 'slideInLeft 0.4s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(45deg, #1a0b2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 75%, #1a0b2e 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
