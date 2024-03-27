import { ThemeElement, html, customElement, property, keyed } from '@riffian-web/ui/shared/theme-element'
import { walletStore, StateController } from '@riffian-web/ethers/src/wallet'
// Components
import '~/components/user/tracks'
import '~/components/uservotes/list'
import '~/components/user/dashboard'

// Style
import style from './index.css?inline'

@customElement('profile-page')
export class ProfilePage extends ThemeElement(style) {
  bindWallet: any = new StateController(this, walletStore)

  @property({ type: String }) cate = ''

  get account() {
    return walletStore.account
  }

  renderList = () => {
    if (!this.account) return ''
    if (this.cate === 'uploaded') return html`<track-list .address=${this.account}></track-list>`
    return html`<user-votes-list by="id" .acc=${this.account}></user-votes-list>`
  }

  render() {
    return html`<div class="page page-profile ui-container mx-auto pt-4 lg_pt-10">
      <!-- Dashboard -->
      <user-dashboard self .acc=${this.account}></user-dashboard>
      <!-- Categories -->
      <div class="mt-6 lg_mt-14">
        <div class="w-full flex gap-8 px-2 pb-3 text-lg border-b border-slate-50/10">
          <ui-link nav href="/profile" exact dense>Voted</ui-link>
          <ui-link nav href="/profile/uploaded" exact dense>Uploaded</ui-link>
        </div>
        ${keyed(this.cate, html`${this.renderList()}`)}
      </div>
    </div>`
  }
}
