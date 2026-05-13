import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ['var(--font-oswald)', 'sans-serif'],
        mulish:  ['var(--font-mulish)', 'sans-serif'],
      },
      colors: {
        cream:   '#f7f4ef',
        paper:   '#ffffff',
        border:  '#e8e2d8',
        border2: '#d0c8b8',
        ink:     '#1c1810',
        ink2:    '#3a3228',
        muted:   '#8c8070',
        muted2:  '#c0b8a8',
        brand: {
          red:    '#d63a1a',
          orange: '#e87a20',
          gold:   '#d4a020',
          green:  '#2a9040',
          teal:   '#0a7868',
          blue:   '#1868b0',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card:    '0 2px 16px rgba(0,0,0,0.06)',
        'card-lg':'0 8px 40px rgba(0,0,0,0.10)',
        'red':   '0 4px 18px rgba(214,58,26,0.30)',
      },
      animation: {
        'fade-up':  'fadeUp 0.5s ease both',
        'fade-in':  'fadeIn 0.4s ease both',
        'grow-bar': 'growBar 1.2s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}

export default config
