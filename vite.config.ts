import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the build works from any subpath (GitHub Pages project
  // sites are served under /repo-name/, Netlify serves from the root — this
  // works for both without any per-host configuration).
  base: './',
})
