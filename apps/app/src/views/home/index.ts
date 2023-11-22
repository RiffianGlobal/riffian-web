import { TailwindElement, html, customElement } from '@riffian-web/ui/src/shared/TailwindElement'
import { goto } from '@riffian-web/ui/src/shared/router'
// Components
import '@riffian-web/ui/src/connect-wallet/btn'
import '~/components/newAlbum'
import '~/components/createAlbum/btn'

// Style
import style from './index.css?inline'
import logo from '~/assets/logo.svg'

@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  render() {
    return html`<div class="home">
      <div class="ui-container my-4">
        <img class="w-24 mx-auto object-contain select-none pointer-events-none" src="${logo}" />
      </div>
      <div class="ui-container">
        <p class="text-center">Home</p>
        <new-album></new-album>
        <create-album-btn></create-album-btn>
      </div>
    </div>`
  }
}
