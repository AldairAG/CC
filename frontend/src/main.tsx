import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { cacheManager } from './service/cache/cacheManager'

// Configurar limpieza automática del cache en desarrollo
if (import.meta.env?.DEV) {
  cacheManager.configureAutoCleanup(true);
  console.log('🚀 Cache Redis service initialized with auto-cleanup');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
