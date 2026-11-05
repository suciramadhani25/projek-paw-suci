
import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: [
        'index.html',
        'profil.html',
        'dokumentasi.html'
      ]
    }
  }
})
