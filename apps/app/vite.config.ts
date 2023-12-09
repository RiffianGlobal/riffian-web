const { resolve } = require('node:path')
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { viteConfig } from '../../packages/ui/src/shared/vite.config'
import { normalizePath } from 'vite'
// import { viteConfig } from '@riffian-web/ui/src/shared/vite.config'

export default ({ mode = '' }) => {
  return viteConfig({
    server: { port: 3000 },
    build: {
      emptyOutDir: mode === 'development'
    },
    plugins:
      mode === 'development'
        ? []
        : [
            viteStaticCopy({
              targets: [
                {
                  src: normalizePath(resolve(__dirname, './public/CNAME')),
                  dest: './'
                }
              ]
            })
          ]
  })({ mode })
}
