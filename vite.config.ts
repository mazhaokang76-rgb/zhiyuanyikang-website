import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-info'

const isProd = process.env.BUILD_MODE === 'prod'
export default defineConfig({
  plugins: [
    react(), 
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: 'data-matrix',
      includeProps: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 优化静态资源文件名
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.(css)$/.test(assetInfo.name)) {
            return 'assets/[name]-[hash][extname]'
          }
          if (assetInfo.name && /\.(png|jpg|jpeg|svg|gif|webp|ico)$/.test(assetInfo.name)) {
            return 'images/[name]-[hash][extname]'
          }
          if (assetInfo.name && /\.(pdf|doc|docx|xls|xlsx)$/.test(assetInfo.name)) {
            return 'documents/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    // 优化构建性能
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false
  },
  // 优化开发服务器配置
  server: {
    host: true,
    port: 5173
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'react-router-dom'
    ]
  }
})

