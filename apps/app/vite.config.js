import { env } from '@lit-web3/base/vite.config.base'
import viteAppConfig from '@lit-web3/base/vite.config.app'
import { VitePWA } from 'vite-plugin-pwa'
import commonjs from 'vite-plugin-commonjs'

export default ({ mode = '' }) => {
  return viteAppConfig({
    server: { port: 3000 },
    // S TODO: remove this after app@^1.0.0
    viteAppConfig: { pwa: false },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    plugins: [
      commonjs(),
      VitePWA({
        selfDestroying: true,
        registerType: 'autoUpdate',
        manifest: {
          name: env.VITE_APP_TITLE || env.npm_package_displayName,
          short_name: env.VITE_APP_NAME,
          lang: 'en',
          background_color: env.VITE_APP_BG
        }
      })
    ]
    // E
  })({ mode })
}
