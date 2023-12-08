import { resolve } from 'node:path'
import { defineConfig, splitVendorChunkPlugin, normalizePath } from 'vite'
import type { UserConfig } from 'vite'
//
import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteStaticCopy } from 'vite-plugin-static-copy' // v1.0.0 is buggly
import minifyHTMLLiterals from 'rollup-plugin-minify-html-literals'
import { config } from 'dotenv'
// Polyfills
import legacy from '@vitejs/plugin-legacy'
import mkcert from 'vite-plugin-mkcert'

// Env
config()

const { env } = process
const [pathRoot, pathSrc] = [env.INIT_CWD, resolve(process.cwd(), './src')]
const appTitle = env.VITE_APP_TITLE || env.VITE_APP_NAME || env.npm_package_name
const mdi = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7/css/materialdesignicons.min.css"/>`

const define = {
  'import.meta.env.VITE_APP_VER': JSON.stringify(env.npm_package_version),
  'import.meta.env.VITE_APP_MDI': JSON.stringify(mdi),
  global: 'globalThis'
}

console.log(viteStaticCopy)

export const viteConfig = (options = <Record<string, any>>{}) => {
  const { server: { https = true } = {}, viteConfigOptions = {} } = options
  return ({ mode = '' }) => {
    const isDev = mode === 'development'
    if (isDev) env.TAILWIND_MODE = 'watch'

    const defaultConfig: UserConfig = {
      base: env.VITE_APP_BASE || '/',
      define,
      server: {
        port: 3000,
        proxy: {},
        fs: { strict: false },
        host: true,
        https
      },
      resolve: {
        alias: [
          { find: /^[~@]\//, replacement: pathSrc + '/' },
          { find: '@lit-labs/router', replacement: '@riffian-web/router/src/index.ts' }
        ]
      },
      build: {
        ...(isDev ? { minify: false, sourcemap: 'inline' } : {}),
        rollupOptions: {
          // external: /^lit/
          // input: {
          //   main: resolve(process.cwd(), 'index.html')
          // }
        }
      },
      css: {
        devSourcemap: true,
        modules: { generateScopedName: '[hash:base64:6]' }
      },
      plugins: [
        ...(https ? [mkcert()] : []),
        minifyHTMLLiterals(),
        ...(viteConfigOptions.splitChunk === false ? [] : [splitVendorChunkPlugin()]),
        ...(viteConfigOptions.html === false
          ? []
          : [
              createHtmlPlugin({
                inject: {
                  data: {
                    HEAD: `<meta charset="UTF-8" />
                <link rel="icon" href="/favicon.ico" />
                <meta
                  name="viewport"
                  content="width=device-width,user-scalable=0,initial-scale=1,maximum-scale=1,minimal-ui,viewport-fit=cover"
                />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="${env.VITE_APP_FG}" />
                <meta name="apple-mobile-web-app-title" content="${appTitle}" />
                <meta name="application-name" content="${appTitle}" />
                <meta name="msapplication-TileColor" content="${env.VITE_APP_BG}" />
                <meta name="theme-color" content="${env.VITE_APP_BG}" />
                <title>${appTitle}</title>
                <meta name="description" content="${env.VITE_APP_DESC}" />
                <meta name="og:type" content="website" />
                ${mdi}
                <script type="module" src="/src/main.ts"></script>
              `,
                    BODY: `
              <app-root></app-root>
              ${
                isDev || !env.VITE_APP_GA
                  ? ''
                  : `<script async src="https://www.googletagmanager.com/gtag/js?id=${env.VITE_APP_GA}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config', '${env.VITE_APP_GA}')</script>`
              }
              `
                  }
                },
                minify: true
              })
            ]),
        ...(isDev || viteConfigOptions.copies
          ? viteConfigOptions.copies ?? []
          : [
              viteStaticCopy({
                targets: [
                  // Github Pages
                  {
                    src: 'dist/index.html',
                    dest: './',
                    rename: '404.html'
                  },
                  {
                    src: normalizePath(resolve(__dirname, './.nojekyll')),
                    dest: './'
                  }
                ]
              })
            ]),
        ...(viteConfigOptions.pwa === false
          ? []
          : [
              VitePWA({
                // selfDestroying: true,
                registerType: 'autoUpdate',
                manifest: {
                  name: env.VITE_APP_TITLE || env.npm_package_displayName,
                  short_name: env.VITE_APP_NAME,
                  lang: 'en',
                  background_color: env.VITE_APP_BG
                }
              })
            ]),
        ...(viteConfigOptions.legacy === false
          ? []
          : [
              //TODO: Disabled for `BigInt` error (@vitejs/plugin-legacy@5.2.0)
              // legacy({
              //   polyfills: ['web.url', 'es.object.from-entries']
              // })
            ])
      ],
      optimizeDeps: {
        include: ['readable-stream']
      }
    }
    // options (shallow merge)
    const merge = (src: any, dest: any) => {
      for (var key in dest) {
        if (key === 'viteConfigOptions') continue
        let [vSrc, vDest] = [src[key], dest[key]]
        if (vSrc && Array.isArray(vSrc)) {
          vDest.forEach((dest: unknown) => {
            const found = vSrc.some((r: unknown) => r == dest)
            if (!found) vSrc.push(dest)
          })
        } else if (vSrc && typeof vSrc === 'object') merge(vSrc, vDest)
        else src[key] = vDest
      }
    }
    merge(defaultConfig, options)
    return defineConfig(defaultConfig)
  }
}

export default { viteConfig }