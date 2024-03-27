import { ThemeElement, html, customElement, state, when, property, keyed } from '@riffian-web/ui/shared/theme-element'
import emitter from '@lit-web3/base/emitter'
import { walletStore, StateController } from '@riffian-web/ethers/src/wallet'
import { rewardStore } from '~/store/reward'
import { tweetStore, type Social } from '~/store/tweet'
import { user } from '~/components/user/action'
import { formatUnits } from 'ethers'
import { DOIDStore } from '@riffian-web/ethers/src/doid-resolver'
// Components
import '~/components/user/tracks'
import '~/components/uservotes/list'

// Style
import style from './dashboard.css?inline'

const defStat = (): Record<string, any> => ({ own: null, holding: null, rewards: null, claimed: null })

@customElement('user-dashboard')
export class UserDashboard extends ThemeElement(style) {
  bindWallet: any = new StateController(this, walletStore)
  bindReward: any = new StateController(this, rewardStore)
  bindDOID: any = new StateController(this, DOIDStore)

  @property({ type: String }) acc = ''
  @property({ type: String }) cate = ''
  @property({ type: Boolean }) self = false

  @state() user: any = null
  @state() social: Social | undefined
  @state() stat = defStat()
  @state() pending = false
  @state() err = ''
  @state() inited = false
  @state() address = ''

  get account() {
    return this.self ? walletStore.account : this.acc
  }
  get itsMe() {
    return walletStore.account == this.account
  }
  get loading() {
    return !this.inited && this.pending
  }
  get key() {
    return this.account + this.cate
  }

  fetch = async () => {
    this.pending = true
    try {
      this.address = (await DOIDStore.getAddress(this.account)) ?? ''
      const { user: uInfo } = await user(this.address)
      this.user = uInfo
      // social
      const { socials = [], holding, rewardClaimed: claimed, subjectsCreated: created } = uInfo
      const { uri } = socials[0] ?? {}
      this.social = await tweetStore.fromUri(uri, this.address)
      // statistics
      this.stat = {
        ...this.stat,
        own: created.length,
        holding,
        rewards: '',
        claimed: parseFloat((+formatUnits(claimed)).toFixed(2))
      }
    } catch {
      this.user = null
    }
    this.pending = false
    this.inited = true
  }

  async connectedCallback() {
    super.connectedCallback()
    await this.fetch()
    emitter.on('block-world', this.fetch)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.off('block-world', this.fetch)
  }

  render() {
    return html`${keyed(
      this.key,
      html`
        <div class="py-2 lg_py-0 flex flex-col lg_flex-row gap-4 justify-between items-center">
          <div>
            ${when(
              !this.inited && !this.err,
              () =>
                html`${when(
                  this.loading,
                  () =>
                    html`<div class="self-start lg_self-center">
                      <loading-skeleton num="2"></loading-skeleton>
                    </div>`
                )}`,
              () => html`
                <div class="flex flex-col items-center lg_items-start leading-none">
                  <!-- address -->
                  <div class="lg_min-h-6 text-lg">
                    <ui-address class="text-lg" .address=${this.address} short avatar></ui-address>
                  </div>
                  <!-- social -->
                  <div class="flex items-center lg_min-h-6 text-sm font-light">
                    ${when(
                      this.social?.id,
                      () => html`
                        <i class="lg_mr-1.5 mdi mdi-twitter opacity-60"></i>
                        <span class="font-light">
                          ${this.social?.name}<span class="ml-0.5">
                            ${when(
                              this.social?.verified,
                              () => html`<i class="text-green-600 mdi mdi-check-decagram"></i>`
                            )}</span
                          >
                          <ui-link href="${this.social?.url}">${this.social?.id ? '@' : ''}${this.social?.id}</ui-link>
                        </span>
                      `
                    )}
                  </div>
                </div>
              `
            )}
          </div>
          <div
            class="w-full lg_w-1/2 lg_h-32 grid grid-cols-4 lg_gap-4 divide-x divide-white/20 md_divide-x-0 items-center border-x border-white/20 lg_border-none"
          >
            <div
              class="h-full lg_h-24 flex flex-col justify-center items-center lg_rounded-xl gapy-y-1 lg_gap-y-1.5 lg_bg-white/5"
            >
              <span class="text-xs md_text-base text-gray-500">Upload</span>
              <div class="text-xl lg_text-2xl font-light">${!this.inited ? '-' : this.stat.own ?? 0}</div>
            </div>
            <div
              class="h-full lg_h-24 flex flex-col justify-center items-center lg_rounded-xl gapy-y-1 lg_gap-y-1.5 lg_bg-white/5"
            >
              <span class="text-xs md_text-base text-gray-500">Holding</span>
              <div class="text-xl lg_text-2xl font-light">${!this.inited ? '-' : this.stat.holding ?? '0'}</div>
            </div>
            <div
              class="h-full lg_h-24 flex flex-col justify-center items-center lg_rounded-xl gapy-y-1 lg_gap-y-1.5 lg_bg-white/5"
            >
              <span class="text-xs md_text-base text-gray-500">Rewards</span>
              <div class="text-xl lg_text-2xl font-light">
                ${this.inited ? (rewardStore.totalHumanized ? rewardStore.totalHumanized : '0') : '-'}
              </div>
            </div>
            <div
              class="h-full lg_h-24 flex flex-col justify-center items-center lg_rounded-xl gapy-y-1 lg_gap-y-1.5 lg_bg-white/5"
            >
              <span class="text-xs md_text-base text-gray-500">Claimed</span>
              <div class="text-xl lg_text-2xl font-light">${this.stat.claimed ?? '-'}</div>
            </div>
          </div>
        </div>
      `
    )} `
  }
}
