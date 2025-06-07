import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      // Polyfills para módulos Node.js no browser
      buffer: 'buffer',
      process: 'process/browser',
    },
    // Forçar uma única instância de styled-components
    dedupe: ['styled-components']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      external: [
        // Módulos PostgreSQL que não devem ser bundlados
        'pg',
        'pg-pool',
        'pg-cloudflare',
        'pgpass',
        'pg-connection-string',
        'cloudflare:sockets',
        // Módulos Node.js
        'fs',
        'path',
        'crypto',
        'stream',
        'util',
        'os',
        'net',
        'tls',
        'dns'
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          animations: ['framer-motion']
        },
        globals: {
          // Mapear módulos externos para variáveis globais se necessário
          'pg': 'undefined',
          'pg-pool': 'undefined',
          'pg-cloudflare': 'undefined'
        }
      }
    },
    // Ignorar avisos sobre módulos externos
    target: 'esnext',
    minify: 'esbuild'
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true
    }
  },  // Configurações para evitar warnings sobre módulos Node.js
  optimizeDeps: {
    exclude: ['pg', 'pg-pool', 'pg-cloudflare'],
    include: ['styled-components']
  }
})
