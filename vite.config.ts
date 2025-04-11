import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',        // your popup HTML
        content: 'src/content.ts', // your content script
        background: 'src/background.ts' // your background script
      },
      output: {
        entryFileNames: '[name].js', // this outputs background.js, content.js
      }
    }
  }
})
