import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteImageOptimizer({
      // Options for image optimization
      jpg: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      png: {
        quality: 80,
      },
      webp: {
        quality: 80,
        lossless: false,
        effort: 6,
      },
      includePublic: true,
      test: /.*\.(jpe?g|png|gif|webp|avif|svg)$/i,
    }),
  ],
  build: {
    assetsInlineLimit: 0, // Ensure all assets are in separate files
    rollupOptions: {
      output: {
        manualChunks: {
          // Create separate chunks for vendor code and our app code
          vendor: ['vue', 'vue-router', 'pinia'],
          app: ['./src/main.ts']
        },
        // Ensure consistent chunk naming for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Put optimized images in a separate directory
          if (assetInfo.name?.match(/\.(png|jpe?g|svg|gif|webp|avif)$/)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[ext]/[name]-[hash][extname]';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/_shared.scss";`
      }
    }
  }
})
