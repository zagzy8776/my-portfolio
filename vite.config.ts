import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion', 'gsap'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
