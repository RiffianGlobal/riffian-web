import { html } from 'lit'

export const routes = [
  {
    name: 'home',
    path: '/',
    render: () => html`<view-home></view-home>`,
    enter: async () => {
      await import('~/views/home')
      return true
    }
  },
  {
    name: 'settings',
    path: '/settings',
    render: () => html`<view-settings></view-settings>`,
    enter: async () => {
      await import('~/views/settings')
      return true
    }
  },
  {
    name: 'docs',
    path: '/docs',
    render: () => html`<view-docs></view-docs>`,
    enter: async () => {
      await import('~/views/docs')
      return true
    }
  }
]

export default routes
