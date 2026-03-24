import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, type Plugin } from 'vite'
import { createProxyMiddleware } from 'http-proxy-middleware'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

/**
 * Vite 内置 server.proxy 在部分环境下不转发 /api，导致浏览器出现 Cannot GET /api/...
 * 使用 connect 中间件 + http-proxy-middleware，并 enforce: pre 保证优先匹配。
 */
function apiProxyPlugin(apiTarget: string): Plugin {
  // 不能用 use('/api', proxy)：Connect 会剥掉 /api，后端收到 /auth/login → 404。
  // 用 pathFilter + 完整 req.url，后端才能收到 /api/auth/login。
  const proxy = createProxyMiddleware({
    target: apiTarget,
    changeOrigin: true,
    pathFilter: '/api',
    // 大文件 Excel 上传经代理时需更长超时（毫秒）
    timeout: 30 * 60 * 1000,
    proxyTimeout: 30 * 60 * 1000,
  }) as any

  return {
    name: 'api-proxy-middleware',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use(proxy)
    },
    configurePreviewServer(server) {
      server.middlewares.use(proxy)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:3000'

  return {
    plugins: [apiProxyPlugin(apiTarget), vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
