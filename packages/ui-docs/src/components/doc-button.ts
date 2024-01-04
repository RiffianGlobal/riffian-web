import { customElement, ThemeElement, html } from '@riffian-web/ui/shared/theme-element'
// Components
import '@riffian-web/ui/button'

@customElement('doc-button')
export class DocButton extends ThemeElement('') {
  override render() {
    return html`
      <p class="flex w-full items-center gap-2 my-2">
        <ui-button>Normal</ui-button>
        <ui-button disabled>Disabled</ui-button>
        <ui-button pending>Pending</ui-button>
        <ui-button sm>Small</ui-button>
        <ui-button sm dense>Dense</ui-button>
        <ui-button lg>Large</ui-button>
      </p>
      <p class="flex w-full items-center gap-2 my-2">
        <ui-button icon sm><i class="mdi mdi-check"></i></ui-button>
        <ui-button icon><i class="mdi mdi-check"></i></ui-button>
        <ui-button icon lg><i class="mdi mdi-check"></i></ui-button>
      </p>
      <p class="flex w-full items-center gap-2 my-2">
        <ui-button class="secondary">Secondary</ui-button>
        <ui-button class="minor">Minor</ui-button>
        <ui-button class="success">Success</ui-button>
        <ui-button class="outlined">Outlined</ui-button>
        <ui-button text>Text</ui-button>
        <ui-button href="">link with href</ui-button>
      </p>
      <p class="flex w-full items-center gap-2 my-2">
        <ui-button><i class="mdi mdi-check -ml-1 mr-1"></i>Icon Left</ui-button>
        <ui-button>Icon Right<i class="mdi mdi-check -mr-1 ml-1"></i></ui-button>
        <ui-button text><i class="mdi mdi-check -ml-1 mr-1"></i>Text</ui-button>
        <ui-button class="outlined" sm><i class="mdi mdi-check -ml-1 mr-1"></i>Outlined</ui-button>
      </p>
    `
  }
}
