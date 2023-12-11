import { viteConfig } from '@riffian-web/ui/src/shared/vite.config.js'

export default ({ mode = '' }) => {
  return viteConfig({
    test: { globals: true, environment: 'jsdom', setupFiles: ['./src/setup.ts'], deps: { inline: ['@lit-app/state'] } },
    server: { port: 4799 }
  })({ mode })
}
