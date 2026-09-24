import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: "./",
  build: {
    outDir: "../backbone/webview/output",
    assetsDir: "assets",
    sourcemap: false,
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
})
