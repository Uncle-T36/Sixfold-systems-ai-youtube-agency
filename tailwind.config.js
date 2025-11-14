/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Imperial Green, Azure, Lavender, Yellow & Black palette
        primary: {
          50: '#f0fdf4',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#00563F', // Imperial Green - luxury, growth, wealth
          600: '#004d38',
          700: '#003d2c',
          800: '#002d21',
          900: '#001d16',
        },
        luxury: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#FFD700', // Gold/Yellow - wealth, premium, luxury
          600: '#d4af37',
          700: '#b8941f',
          800: '#9c7a0f',
          900: '#806000',
        },
        azure: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#007FFF', // Azure Blue - trust, clarity, professionalism
          600: '#0066cc',
          700: '#004d99',
          800: '#003366',
          900: '#001a33',
        },
        lavender: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#967BB6', // Lavender - elegance, creativity, premium
          600: '#7a6396',
          700: '#5e4b76',
          800: '#423356',
          900: '#261b36',
        },
        success: {
          50: '#f0fdf4',
          100: '#d1fae5',
          500: '#00563F',
          600: '#004d38',
          700: '#003d2c',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#FFD700',
          600: '#d4af37',
          700: '#b8941f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        slate: {
          850: '#1a202e',
          950: '#000000', // Pure Black
        },
        dark: {
          bg: '#000000',      // Pure Black
          card: '#1a1a1a',    // Very dark gray
          border: '#2a2a2a',  // Dark gray borders
        },
        accent: {
          imperial: '#00563F',   // Imperial Green
          azure: '#007FFF',      // Azure Blue
          lavender: '#967BB6',   // Lavender
          gold: '#FFD700',       // Gold Yellow
          black: '#000000',      // Pure Black
        },
        wealth: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#FFD700',
          600: '#d4af37',
          700: '#b8941f',
          800: '#9c7a0f',
          900: '#806000',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-wealth': 'linear-gradient(135deg, #00563F 0%, #FFD700 100%)',  // Imperial Green to Gold
        'gradient-premium': 'linear-gradient(135deg, #007FFF 0%, #967BB6 100%)', // Azure to Lavender
        'gradient-imperial': 'linear-gradient(135deg, #00563F 0%, #007FFF 100%)', // Imperial Green to Azure
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
