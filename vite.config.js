import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  resolve: {
    alias: {
      // Polyfills para módulos Node.js no browser
      buffer: 'buffer',
      process: 'process/browser',
    },
    // Forçar uma única instância de styled-components
    dedupe: ['styled-components']
  },
  define: {
    'process.env': {}
  },
  define: {
    // Necessário para garantir que process.env esteja disponível no cliente
    'process.env': {},
    // Permitir acesso global ao process no cliente
    'global': {},
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
        'tls',        'dns'
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          animations: ['framer-motion'],
          csv: ['react-csv']
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
  },  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
    watch: {
      usePolling: true
    },    hmr: {
      // Configuração explícita para WebSocket em Docker
      clientPort: 5173,
      host: 'localhost',
      port: 5173,
      // Protocolo WebSocket
      protocol: 'ws',
      // Configuração para modos de conexão fallback
      overlay: true,
      // Tempo extra para conexão
      timeout: 30000,
      // Tentativas de reconexão
      reconnect: 10
    },
    cors: {
      origin: '*'
    }
  },
  // Configurações para evitar warnings sobre módulos Node.js
  optimizeDeps: {
    exclude: ['pg', 'pg-pool', 'pg-cloudflare'],
    include: ['styled-components', 'react-csv']
  }
})
