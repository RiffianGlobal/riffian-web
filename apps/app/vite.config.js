import viteAppConfig from '@lit-web3/base/vite.config.app'

export default ({ mode = '' }) => {
  return viteAppConfig({
    server: { port: 3000 },
    build: {
      emptyOutDir: mode === 'development'
    }
  })({ mode })
}
