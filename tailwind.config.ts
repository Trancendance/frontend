import type { Config } from 'tailwindcss'

export default {
  content: ['./public/**/*.html', './src/ts/**/*.{ts,js}'],
  theme: { extend: {} },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ]
} satisfies Config
