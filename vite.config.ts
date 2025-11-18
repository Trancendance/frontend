import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import extractTailwind from './public/extract-tailwind'
import fs from 'fs'

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
	server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "certs/fd_transcendence.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "certs/fd_transcendence.crt"))
    },
    hmr: {
      protocol: "wss",
      host: "localhost",
      port: 5173
    },
    watch: {
      usePolling: true
    }
	}
})