import { customElement, TailwindElement, html, when, state, property } from '@riffian-web/ui/src/shared/TailwindElement'
// Components
import '@riffian-web/ui/src/button'

@customElement('doc-button')
export class DocButton extends TailwindElement('') {
  override render() {
    return html`
      <p class="flex w-full gap-2 my-2">
        <ui-button>Normal</ui-button>
        <ui-button disabled>Disabled</ui-button>
        <ui-button pending>Pending</ui-button>
        <ui-button sm>Small</ui-button>
        <ui-button sm dense>Dense</ui-button>
      </p>
      <p class="flex w-full gap-2 my-2">
        <ui-button icon><i class="mdi mdi-check"></i></ui-button>
      </p>
      <p class="flex w-full gap-2 my-2">
        <ui-button class="outlined">Outlined</ui-button>
        <ui-button text>Text</ui-button>
        <ui-button href="">link href</ui-button>
      </p>
      <p class="flex w-full gap-2 my-2">
        <ui-button><i class="mdi mdi-check -ml-1 mr-1"></i>Icon Left</ui-button>
        <ui-button>Icon Right<i class="mdi mdi-check -mr-1 ml-1"></i></ui-button>
      </p>
    `
  }
}
