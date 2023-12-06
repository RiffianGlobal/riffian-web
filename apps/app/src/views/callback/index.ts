import { TailwindElement, html, customElement, state } from '@riffian-web/ui/src/shared/TailwindElement'
import '~/components/uservotes/list'

// Style
import style from './index.css?inline'

@customElement('social-callback')
export class ViewTop extends TailwindElement(style) {
  connectedCallback() {
    super.connectedCallback()
    console.log(window.location.search)
  }

  render() {
    return html`<div class="top">
      <div class="ui-container relative flex justify-between items-center">
        <div class="flex items-center gap-3 lg_gap-4 lg_w-40">
          <p class="font-bold text-xl">Bind Social</p>
        </div>
      </div>
      <div class="ui-container">Bind social page</div>
    </div>`
  }
}
