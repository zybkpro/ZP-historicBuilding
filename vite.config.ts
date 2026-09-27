import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// 相对路径：兼容 GitHub Pages（/ZP-historicBuilding/）与 Nginx 子目录部署
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    // 端口被占用时自动 +1（5173 → 5174 …），不直接退出
    strictPort: false,
  },
  preview: {
    strictPort: false,
  },
})
