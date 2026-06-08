import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#f4f6f2',
        paper: '#fbfbf8',
        ink: '#1d2c23',
        moss: '#355f45',
        sand: '#d9d3b7',
        accent: '#e26d43',
      },
      fontFamily: {
        display: ['\"Plus Jakarta Sans\"', 'ui-sans-serif', 'sans-serif'],
        body: ['\"IBM Plex Sans\"', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        card: '0 14px 30px rgba(36, 56, 45, 0.12)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 450ms ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
