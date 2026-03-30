import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
        },
        bg: {
          base: '#0f0f1a',
          card: 'rgba(255,255,255,0.05)',
        },
      },
    },
  },
  plugins: [],
}

export default config
