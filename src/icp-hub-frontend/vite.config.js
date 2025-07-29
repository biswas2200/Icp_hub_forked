import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Environment variable prefix
  envPrefix: 'VITE_',
  
  // Development server configuration
  server: {
    host: 'localhost',
    port: 5173,
    open: true,
    cors: true,
    // Proxy API requests to DFX local network
    proxy: {
      '/api': {
        target: 'http://localhost:4943',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          dfinity: ['@dfinity/agent', '@dfinity/auth-client', '@dfinity/candid', '@dfinity/principal'],
          ui: ['lucide-react', 'three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },
  
  // Define global constants
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    global: 'globalThis',
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@dfinity/agent',
      '@dfinity/auth-client',
      '@dfinity/candid',
      '@dfinity/principal',
      'lucide-react',
    ],
    exclude: ['@dfinity/candid/lib/cjs/idl'],
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  
  // Error handling in development
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  
  // Worker configuration for Web Workers
  worker: {
    format: 'es',
  },
})
