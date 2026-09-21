/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        /* Editorial serif for display, quiet grotesque for text.
           `syne` / `nasalization` are legacy aliases still used in markup. */
        display:      ['Chronicle Display', 'Newsreader', 'Georgia', 'serif'],
        body:         ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        brand:        ['Nasalization', 'Newsreader', 'serif'],
        syne:         ['Chronicle Display', 'Newsreader', 'Georgia', 'serif'],
        nasalization: ['Nasalization', 'Newsreader', 'serif'],
        inter:        ['Inter', '-apple-system', 'sans-serif'],
        mono:         ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        terracotta: {
          50:  '#FBF3EF', 100: '#F6E4DB', 200: '#EDC7B7', 300: '#E1A48C',
          400: '#D68667', 500: '#C96A4A', 600: '#AE563A', 700: '#8C432C',
          800: '#6B3323', 900: '#4A241A',
        },
        sand: {
          50:  '#FDFAF6', 100: '#F8F1E7', 200: '#EEDCC8',
          300: '#E0C8AC', 400: '#C9AC8C', 500: '#A98C6D',
        },
        ink: {
          300: '#C0AB9E', 400: '#9C8375', 500: '#79604F',
          600: '#55413A', 700: '#33261F', 800: '#241C18', 900: '#1B1412',
        },
        /* Legacy aliases — now brand-aware */
        accent:  '#C96A4A',
        accent2: '#EEDCC8',
      },
      borderRadius: {
        xs: '3px', sm: '5px', md: '8px', lg: '12px', xl: '18px',
      },
    },
  },
  plugins: [],
}
