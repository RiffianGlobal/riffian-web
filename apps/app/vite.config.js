import { viteConfig } from '@riffian-web/ui/src/shared/vite.config.js'

export default ({ mode = '' }) => {
  return viteConfig({ server: { port: 3000 } })({ mode })
}
