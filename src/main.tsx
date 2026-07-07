import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { isSupabaseConfigured } from './lib/supabase.ts'

console.info('[Wafra boot]', {
  baseUrl: import.meta.env.BASE_URL,
  supabaseConfigured: isSupabaseConfigured,
  mode: import.meta.env.MODE,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
