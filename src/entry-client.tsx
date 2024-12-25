import { hydrateRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App'

import './index.css'

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
)