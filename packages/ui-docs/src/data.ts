import emitter from '@riffian-web/core/src/emitter'

export const cmps = [
  'doc-button',
  'doc-link',
  'doc-address',
  'doc-dialog',
  'doc-progress',
  'doc-switch',
  'doc-text',
  'doc-form',
  'doc-tip',
  'doc-image',
  'doc-menu',
  'doc-loading',
  'doc-pagination'
]

export const names = cmps.map((cmp) => cmp.split('-')[1])

export const loadComponents = async () => {
  await Promise.all(cmps.map(async (cmp) => await import(`./components/${cmp}.ts`)))
  emitter.emit('docs-loaded')
}
