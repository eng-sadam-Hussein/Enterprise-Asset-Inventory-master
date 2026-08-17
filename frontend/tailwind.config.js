/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0D47A1',
          teal: '#11B5A6',
          orange: '#FF8C00',
        },
        blue: {
          50: '#eef5ff', 100: '#d9e8ff', 200: '#b8d3ff', 300: '#89b5ff', 400: '#4f8ef7',
          500: '#2468d8', 600: '#0D47A1', 700: '#0a3b87', 800: '#0a316d', 900: '#092a5a', 950: '#061a3a',
        },
        emerald: {
          50: '#ecfdfb', 100: '#d0faf5', 200: '#a5f3e9', 300: '#6ee7d8', 400: '#36d1c1',
          500: '#11B5A6', 600: '#0b968b', 700: '#08796f', 800: '#096159', 900: '#0b504a', 950: '#03312e',
        },
        orange: {
          50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c',
          500: '#FF8C00', 600: '#e87700', 700: '#c15e00', 800: '#994a05', 900: '#7b3f0b', 950: '#431f05',
        },
      },
      fontFamily: {
        sans: ['Aptos', '"Segoe UI Variable"', '"Segoe UI"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Aptos', '"Segoe UI Variable"', '"Segoe UI"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(13,71,161,.05), 0 12px 32px rgba(13,71,161,.055)',
        elevated: '0 24px 60px rgba(2, 18, 46, 0.14)',
        glow: '0 0 0 4px rgba(17,181,166,.15)',
        sidebar: '4px 0 30px rgba(2, 18, 46, 0.28)',
      },
      backgroundImage: {
        'nexora-mesh': 'radial-gradient(ellipse at 10% 10%, rgba(17,181,166,.18), transparent 42%), radial-gradient(ellipse at 85% 10%, rgba(255,140,0,.12), transparent 32%), linear-gradient(180deg,#07152f 0%,#0b234d 100%)',
      },
    },
  },
  plugins: [],
};
