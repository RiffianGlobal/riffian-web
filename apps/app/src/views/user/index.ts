import { ThemeElement, html, customElement, property, state, when, keyed } from '@riffian-web/ui/shared/theme-element'
import '~/components/user/user'
import { DOIDStore } from '@riffian-web/ethers/src/doid-resolver'
// Components
import '~/components/uservotes/list'
import '~/components/user/tracks'
import '~/components/user/dashboard'
// Style
import style from './index.css?inline'

@customElement('user-page')
export class TrackPage extends ThemeElement(style) {
  @property({ type: String }) addr = ''
  @property({ type: String }) cate = ''

  @state() address: any = ''

  async connectedCallback() {
    super.connectedCallback()
    this.address = await DOIDStore.getAddress(this.addr)
  }

  renderList = () => {
    if (!this.addr) return ''
    if (this.cate === 'uploaded') return html`<track-list .address=${this.address}></track-list>`
    return html`<user-votes-list by="id" .acc=${this.address}></user-votes-list>`
  }

  render() {
    if (!this.address) return ''
    return html`<div class="ui-container mx-auto flex flex-col place-content-center md_pt-10">
      <!-- Dashboard -->
      <user-dashboard .acc=${this.address}></user-dashboard>

      <!-- created -->
      <div class="mt-6 lg_mt-14 w-full flex gap-8 px-2 pb-3 text-lg border-b border-slate-50/10">
        <ui-link nav href=${`/user/${this.addr}`} exact dense>Voted</ui-link>
        <ui-link nav href=${`/user/${this.addr}/uploaded`} exact dense>Uploaded</ui-link>
      </div>

      ${keyed(this.cate, html`${this.renderList()}`)}
    </div>`
  }
}
