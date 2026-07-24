/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        base: {
          light: '#f8fafc',
          dark: '#0a0e1a',
        },
        surface: {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(17, 22, 39, 0.7)',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          cyan: '#06b6d4',
          violet: '#a78bfa',
          pink: '#f472b6',
          emerald: '#10b981',
          amber: '#fbbf24',
          rose: '#ef4444',
        },
      },
      backgroundImage: {
        'grid-light': 'linear-gradient(to right, rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.04) 1px, transparent 1px)',
        'grid-dark': 'linear-gradient(to right, rgba(148,163,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,255,0.04) 1px, transparent 1px)',
        'aurora': 'radial-gradient(80% 50% at 20% 0%, rgba(99,102,241,0.18) 0%, transparent 50%), radial-gradient(60% 40% at 80% 10%, rgba(6,182,212,0.14) 0%, transparent 50%), radial-gradient(60% 50% at 50% 100%, rgba(167,139,250,0.12) 0%, transparent 50%)',
        'hero-gradient': 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.06) 50%, rgba(167,139,250,0.08) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
        'glass-lg': '0 20px 60px -10px rgba(31, 38, 135, 0.2)',
        'glass-xl': '0 32px 80px -12px rgba(31, 38, 135, 0.25)',
        glow: '0 0 24px rgba(99, 102, 241, 0.3)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
        'glow-cyan': '0 0 24px rgba(6, 182, 212, 0.3)',
        'glow-emerald': '0 0 24px rgba(16, 185, 129, 0.3)',
        'inner-glow': 'inset 0 1px 2px rgba(255,255,255,0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'counter': 'counter 1s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'dash': 'dash 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' },
        },
        dash: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
