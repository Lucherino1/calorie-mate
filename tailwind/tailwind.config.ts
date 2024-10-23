import type { Config } from 'tailwindcss'
import { colors } from './tailwind.colors'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    colors,
    fontFamily: {
      main: ['DM Sans', 'sans-serif'],
      poppins: ['Poppins', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)'
      }
    }
  },
  plugins: []
} satisfies Config
