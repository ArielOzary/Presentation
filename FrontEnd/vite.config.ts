import react from '@vitejs/plugin-react'
import dns from 'dns'
import path from 'path'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.ENV === 'dev' || process.env.ENV === 'stage' ? '/latest' : '',
  server: {
    host: 'localhost',
    port: 5173,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    pluginRewriteAll(),
    checker({ typescript: true }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        importer(...args) {
          return args[0].startsWith('@')
            ? {
                file: `${path.resolve(
                  __dirname,
                  './src/' + args[0].substring(1)
                )}`,
              }
            : args
        },
      },
    },
  },
})
