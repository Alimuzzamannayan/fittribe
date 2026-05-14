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
        bg:      '#f0f4f8',
        paper:   '#ffffff',
        border:  '#dde8f0',
        border2: '#c8d8e8',
        ink:     '#1a3356',
        ink2:    '#2a4a70',
        muted:   '#5a7090',
        muted2:  '#8a9ab5',
        brand: {
          navy:   '#1a3356',
          green:  '#3da832',
          orange: '#e8701a',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card:     '0 2px 16px rgba(26,51,86,0.08)',
        'card-lg':'0 8px 40px rgba(26,51,86,0.12)',
        green:    '0 4px 18px rgba(61,168,50,0.35)',
        navy:     '0 4px 18px rgba(26,51,86,0.30)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
        'grow-bar':'growBar 1.2s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}

export default config
