import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allows Render to detect the open port
    port: 3000        // Use a fixed port if needed
  }
})
