import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { dependencies } from './package.json'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  ssr: {
    noExternal: mode === 'production' ? Object.keys(dependencies) : undefined,
  },
}))