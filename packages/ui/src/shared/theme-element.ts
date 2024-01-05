export * from '@lit-web3/base/tailwind-element'

import { TailwindElement } from '@lit-web3/base/tailwind-element'
import ThemeDark from './theme-dark.css?inline'

export const ThemeElement = (styles: unknown | unknown[]) =>
  TailwindElement([ThemeDark, ...(Array.isArray(styles) ? styles : [styles])])
