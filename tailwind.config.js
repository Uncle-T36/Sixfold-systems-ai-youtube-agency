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
        // Unique professional money-making palette - NOT the typical AI purple
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Teal - professional, unique
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        luxury: {
          50: '#fef7ff',
          100: '#fce7ff',
          200: '#f9cfff',
          300: '#f5a7ff',
          400: '#ee6fff',
          500: '#e637ff', // Magenta/Hot Pink - stands out
          600: '#c717d9',
          700: '#a015b3',
          800: '#7d148c',
          900: '#5c1266',
        },
        wealth: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
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
          950: '#0f1419',
        },
        // Unique dark theme colors
        dark: {
          bg: '#0a0e14',      // Deep blue-black
          card: '#151b24',    // Card background
          border: '#1f2937',  // Borders
        },
        accent: {
          teal: '#14b8a6',    // Main accent
          pink: '#e637ff',    // Secondary accent
          gold: '#fbbf24',    // Premium gold
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
        'gradient-wealth': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-premium': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}