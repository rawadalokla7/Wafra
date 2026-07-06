import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Absolute base path. Netlify serves from the domain root ('/', the
  // default). GitHub Pages project sites are served under '/repo-name/' —
  // the deploy workflow sets VITE_BASE_PATH for that build so this and the
  // router's basename (see App.tsx) stay in sync automatically.
  base: process.env.VITE_BASE_PATH || '/',
})
