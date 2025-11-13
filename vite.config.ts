import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import extractTailwind from './public/extract-tailwind'

export default defineConfig({
	plugins: [
		tailwindcss(),
		extractTailwind(),
	],
  	resolve: {
    	alias: {
      		'@': path.resolve(__dirname, './src'),
    	},
  	},
})