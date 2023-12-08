import { viteConfig } from '../../packages/ui/src/shared/vite.config'
// import { viteConfig } from '@riffian-web/ui/src/shared/vite.config'

export default ({ mode = '' }) => {
  return viteConfig({ server: { port: 3000 } })({ mode })
}
