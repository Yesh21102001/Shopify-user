import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
      },
      colors: {
        primary: '#000000',
        'primary-hover': '#333333',
        foreground: '#000000',
        subtext: '#666666',
        border: '#e8e8e8',
        'badge-sale': '#da3f3f',
        'badge-new': '#64bf99',
        announcement: '#da3f3f',
        'footer-bg': '#f5f5f5',
        'menubar-bg': '#000000',
        'menubar-text': '#f8f8f8',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: { '2xl': '1200px' },
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        marquee: 'marquee 25s linear infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
export default config
