/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'loading': 'loading 1.5s infinite',
        'ripple': 'ripple 0.6s ease-out',
      },
      keyframes: {
        slideIn: {
          from: {
            opacity: '0',
            transform: 'translateX(100%) scale(0.8)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0) scale(1)',
          },
        },
        fadeIn: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        shake: {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '25%': {
            transform: 'translateX(-5px)',
          },
          '75%': {
            transform: 'translateX(5px)',
          },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 70, 85, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(255, 70, 85, 0.6)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 0 0 rgba(255, 70, 85, 0.7)',
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 0 15px rgba(255, 70, 85, 0)',
          },
        },
        'gradient-shift': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        loading: {
          '0%': {
            backgroundPosition: '200% 0',
          },
          '100%': {
            backgroundPosition: '-200% 0',
          },
        },
        ripple: {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        valorant: {
          red: '#ff4655',
          dark: '#0f1419',
          gray: '#1e2328',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 70, 85, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 70, 85, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(255, 70, 85, 0.2)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};