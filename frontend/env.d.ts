/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 签名链接/二维码使用的站点根地址，如 http://10.2.254.29:3000（部署构建时注入） */
  readonly VITE_PUBLIC_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
