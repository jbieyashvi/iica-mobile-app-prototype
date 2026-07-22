import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path for GitHub Pages project site (served under /<repo>/).
export default defineConfig({
  base: '/iica-mobile-app-prototype/',
  plugins: [react()],
})
