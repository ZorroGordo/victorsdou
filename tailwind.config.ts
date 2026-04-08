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
        // Victorsdou palette matching Figma
        cream: {
          DEFAULT: '#F5F0E8',
          50: '#FDFCFA',
          100: '#FAF8F4',
          200: '#F5F0E8',
          300: '#EBE4D6',
          400: '#DDD3C0',
        },
        green: {
          DEFAULT: '#2D6A4F',
          light: '#4A9158',
          dark: '#2D5A38',
          50: '#E8F5E9',
          100: '#C8E6C9',
          500: '#3D7A4A',
          600: '#2D5A38',
        },
        charcoal: {
          DEFAULT: '#1A1A1A',
          light: '#333333',
          lighter: '#666666',
          muted: '#999999',
        },
        accent: '#D4A574',
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'Caveat', 'cursive'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'section': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      spacing: {
        'section': 'clamp(4rem, 8vw, 6rem)',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

export default config
