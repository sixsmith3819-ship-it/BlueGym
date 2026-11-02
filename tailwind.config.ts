import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0066FF',
        'primary-dark': '#0052CC',
        'secondary': '#00D4FF',
        'accent': '#9D4EDD',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'bg-dark': '#0A0E27',
        'bg-darker': '#050812',
        'surface': '#1a1f3a',
        'surface-light': '#242b48',
      },
      backgroundImage: {
        'gradient-aurora': 'linear-gradient(135deg, #0066FF 0%, #00D4FF 50%, #9D4EDD 100%)',
        'gradient-mesh': 'radial-gradient(circle at 20% 50%, rgba(0, 102, 255, 0.1) 0%, rgba(10, 14, 39, 0) 50%)',
      },
      backdropFilter: {
        'glass': 'blur(10px)',
      },
    },
  },
  plugins: [],
}
export default config
