import { beforeEach, describe, expect, it, vi } from 'vitest'

import { html, el, elInside } from '~/utils'
import '@riffian-web/ui/button'

describe('Button', async () => {
  beforeEach(async () => {})

  it('Click', async () => {
    await html('<ui-button>Click</ui-button>')
    const [el$, el$inside] = [el('ui-button'), elInside('ui-button')]
    expect(el$inside.nodeName).toBe('BUTTON')
    const onClick = vi.fn()
    el$.addEventListener('click', onClick)
    el$inside.click()
    expect(onClick).toHaveBeenCalled()
    expect(el$.hasAttribute('sm')).toBeFalsy()
    expect(el$.hasAttribute('target')).toBeFalsy()
    expect(el$.hasAttribute('rel')).toBeFalsy()
    expect(el$.hasAttribute('href')).toBeFalsy()
  })
  it('Click when disabled', async () => {
    await html('<ui-button disabled>Click</ui-button>')
    const onClick = vi.fn()
    el('ui-button').addEventListener('click', onClick)
    elInside('ui-button').click()
    expect(onClick).not.toHaveBeenCalled()
  })
  it('Click when pending', async () => {
    await html('<ui-button pending>Click</ui-button>')
    const onClick = vi.fn()
    el('ui-button').addEventListener('click', onClick)
    elInside('ui-button').click()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('Anchor mode', async () => {
    await html('<ui-button sm href="">Click</ui-button>')
    const [el$, el$inside] = [el('ui-button'), elInside('ui-button')]
    expect(el$.hasAttribute('sm')).toBeTruthy()
    expect(el$inside.nodeName).toBe('A')
    expect(el$inside.hasAttribute('target')).toBeTruthy()
    expect(el$inside.hasAttribute('rel')).toBeTruthy()
    expect(el$inside.hasAttribute('href')).toBeTruthy()
  })
})
