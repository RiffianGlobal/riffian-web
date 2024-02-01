import { ThemeElement, html, customElement, state, until, when, property } from '@riffian-web/ui/shared/theme-element'
import emitter from '@lit-web3/base/emitter'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { rewardStore } from '~/store/reward'
import { tweetStore, type Social } from '~/store/tweet'
import { formatUnits } from 'ethers'
import { user } from '~/components/user/action'
// Components
import '~/components/uservotes/list'

// Style
import style from './index.css?inline'
const defStat = (): Record<string, any> => ({ own: null, holding: null, rewards: null, claimed: null })
@customElement('profile-page')
export class ProfilePage extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)

  @property() acc = ''

  @state() user: any
  @state() social: Social | undefined
  @state() stat = defStat()
  @state() pending = false
  @state() err = ''
  @state() inited = false

  get itsMe() {
    return this.acc == bridgeStore.bridge.account
  }
  get loading() {
    return !this.inited && this.pending
  }

  fetch = async () => {
    this.pending = true
    try {
      const { user: uInfo } = await user(this.acc)
      this.user = uInfo
      // social
      const { address, socials = [], holding, rewardClaimed: claimed, subjectsCreated: created } = uInfo
      const { uri } = socials[0] ?? {}
      this.social = await tweetStore.fromUri(address, uri)
      // statistics
      this.stat = {
        ...this.stat,
        own: created.length,
        holding,
        rewards: '',
        claimed: parseFloat((+formatUnits(claimed)).toFixed(4))
      }
    } catch (e: any) {
      console.error(e)
    } finally {
      this.pending = false
      this.inited = true
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.fetch()
    emitter.on('block-world', this.fetch)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.off('block-world', this.fetch)
  }

  render() {
    return html`<div class="page page-profile ui-container mx-auto pt-4 lg_pt-10">
      <!-- basic info -->
      <div class="flex flex-col lg_flex-row gap-4 justify-between items-center">
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
              <div>
                <!-- address -->
                <div class="lg_min-h-6 text-base leading-6">
                  <ui-address class="text-lg" .address=${this.user?.address} short avatar></ui-address>
                </div>
                <!-- social -->
                <div class="lg_min-h-6 text-base leading-6">
                  ${when(
                    this.social?.id,
                    () => html`
                      <span class="text-sm font-light middle-dot-divider">
                        ${this.social?.name}<span class="ml-0.5">
                          ${when(
                            this.social?.verified,
                            () => html`<i class="text-green-600 text-sm mdi mdi-check-decagram"></i>`
                          )}</span
                        >
                        <span class="text-sm text-blue-300 font-light">
                          <a href="${this.social?.url}" target="_blank"
                            >${this.social?.id ? '@' : ''}${this.social?.id}</a
                          >
                        </span>
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
            <span class="text-xs md_text-base text-gray-500">Create</span>
            <div class="text-xl lg_text-2xl font-light">${this.account ? this.stat.own : '-'}</div>
          </div>
          <div
            class="h-full lg_h-24 flex flex-col justify-center items-center lg_rounded-xl gapy-y-1 lg_gap-y-1.5 lg_bg-white/5"
          >
            <span class="text-xs md_text-base text-gray-500">Holding</span>
            <div class="text-xl lg_text-2xl font-light">${this.account ? this.stat.holding : '-'}</div>
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
            class="h-full lg_h-24 flex flex-col justify-center items-center lg_rounded-xl gapy-y-1 lg_gap-y-1.5 lg_bg-white/55"
          >
            <span class="text-xs md_text-base text-gray-500">Claimed</span>
            <div class="text-xl lg_text-2xl font-light">${this.stat.claimed ?? '-'}</div>
          </div>
        </div>
      </div>
      <!-- <div class="w-full h-full bg-yellow-700/50">Profile Page</div> -->
      <div class="mt-6 lg_mt-14">
        <div class="w-full inline-flex pb-2 border-b border-slate-50/10">
          <div class="py-1.5 px-3 text-base font-normal text-white/70 rounded-md">Voted</div>
        </div>
        ${when(this.acc, () => html`<user-votes-list by="id" .acc=${this.acc}></user-votes-list>`)}
      </div>
    </div>`
  }
}
