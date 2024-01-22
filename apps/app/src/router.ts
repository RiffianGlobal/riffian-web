import { html } from 'lit'
import emitter from '@lit-web3/base/emitter'
import type { RouteConfig } from '@lit-web3/router'
import { blocked } from '~/lib/ip'

const beforeEach = async () => {
  const isBlocked = await blocked()
  if (isBlocked) emitter.emit('router-replace', `/denied`)
  return isBlocked
}

export const routes: RouteConfig[] = [
  {
    name: 'home',
    path: '/',
    render: () => html`<view-home></view-home>`,
    enter: async () => {
      if (await beforeEach()) return false
      await import('~/views/home')
      return true
    }
  },
  {
    name: 'denied',
    path: '/denied',
    render: () => html`<view-denied></view-denied>`,
    enter: async () => {
      await import('~/views/denied')
      return true
    }
  },
  {
    name: 'settings',
    path: '/settings',
    render: () => html`<view-settings></view-settings>`,
    enter: async () => {
      if (await beforeEach()) return false
      await import('~/views/settings')
      return true
    }
  },
  {
    name: 'top',
    path: '/top',
    render: () => html`<view-top></view-top>`,
    enter: async () => {
      if (await beforeEach()) return false
      await import('~/views/top')
      return true
    }
  },
  {
    name: 'referral',
    path: '/referral/:referrer?',
    render: ({ referrer = '' }) => html`<view-referral .referrer=${referrer}></view-referral>`,
    enter: async () => {
      if (await beforeEach()) return false
      await import('~/views/referral')
      return true
    }
  },
  {
    name: 'uservotes',
    path: '/uservotes',
    render: () => html`<user-votes></user-votes>`,
    enter: async () => {
      if (await beforeEach()) return false
      await import('~/views/uservotes')
      return true
    }
  },
  {
    name: 'track',
    path: '/track/:addr?',
    render: ({ addr = '' }) => html`<track-page addr="${addr}"></track-page>`,
    enter: async () => {
      if (await beforeEach()) return false
      await import('~/views/track')
      return true
    }
  },
  {
    name: 'user',
    path: '/user/:addr?',
    render: ({ addr = '' }) => html`<user-page .addr="${addr}"></user-page>`,
    enter: async () => {
      if (await beforeEach()) return false
      await import('~/views/user')
      return true
    }
  }
]
if (import.meta.env.MODE !== 'production')
  routes.push({
    name: 'docs',
    path: '/docs/:anchor?',
    render: ({ anchor = '' }) => html`<view-docs .anchor="${anchor}"></view-docs>`,
    enter: async ({ anchor = '' }) => {
      if (await beforeEach()) return false
      await import('~/views/docs')
      const scroll2 = () => {
        const target: HTMLElement | null | undefined = document!
          .querySelector('app-root')
          ?.shadowRoot?.querySelector('app-main')
          ?.querySelector('view-docs')
          ?.shadowRoot?.querySelector('ui-docs')
          ?.shadowRoot?.querySelector('ui-components')
          ?.shadowRoot?.querySelector(`[name="${anchor}"]`)
        let top = target?.offsetTop ?? 0
        if (top && top < 200) top = 0
        window.scrollTo(0, top)
      }
      setTimeout(scroll2)
      emitter.on('docs-loaded', scroll2)
      return true
    }
  })

export default routes
