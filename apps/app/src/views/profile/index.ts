import { ThemeElement, html, customElement, state, until, when } from '@riffian-web/ui/shared/theme-element'

import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { rewardStore } from '~/store/reward'
import { tweetStore, type Social } from '~/store/tweet'
import { formatUnits } from 'ethers'

import { user } from '~/components/user/action'
import '~/components/uservotes/list'

// Style
import style from './index.css?inline'
const defStat = () => ({ own: '', holding: '', rewards: '', claimed: '' })
@customElement('profile-page')
export class ProfilePage extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)

  @state() user: any
  @state() social: Social | undefined
  @state() stat = defStat()
  @state() pending = false
  @state() err = ''
  @state() ts = 0

  get account() {
    return bridgeStore.bridge.account
  }

  readFromTwi = async (address = '', uri = '') => {
    if (!address || !uri) return null
    return tweetStore.fromUri(uri, address)
  }

  init = async () => {
    if (!this.account) return
    this.pending = true
    try {
      const { user: uInfo } = await user(this.account)
      this.user = uInfo
      // social
      const { address, socials = [], holding: holding, rewardClaimed: claimed, subjectsCreated: created } = uInfo
      const { uri } = socials[0] ?? {}
      this.social = await this.readFromTwi(address, uri)
      // statistics
      Object.assign(this.stat, {
        own: created.length,
        holding,
        rewards: '',
        claimed: parseFloat((+formatUnits(claimed)).toFixed(4))
      })
    } catch (e: any) {
      console.error(e)
    } finally {
      this.pending = false
      this.ts++
    }
  }
  async connectedCallback() {
    super.connectedCallback()
    await this.init()
    rewardStore.update()
  }

  render() {
    return html`<div class="page page-profile ui-container mx-auto pt-4 lg_pt-10">
      <!-- basic info -->
      <div class="flex flex-col lg_flex-row gap-4 justify-between items-center">
        ${when(
          !this.ts && !this.err,
          () =>
            html`${when(
              this.account,
              () =>
                html`<div class="self-start lg_self-center">
                  <loading-skeleton num="3"></loading-skeleton>
                </div>`
            )}`,
          () => html`
            <div class="mx-2 lg_m-0 self-start lg_self-center">
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
        <div
          class="w-full lg_w-1/2 lg_h-32 grid grid-cols-4 lg_gap-4 divide-x divide-white/20 md_divide-x-0 items-center border-x border-white/20 lg_border-none"
        >
          <div
            class="h-full lg_h-24 flex flex-col justify-center items-center lg_rounded-xl gapy-y-1 lg_gap-y-1.5 lg_bg-white/5 text-white"
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
              ${this.account ? (this.ts ? (rewardStore.totalHumanized ? rewardStore.totalHumanized : '0') : '') : '-'}
            </div>
          </div>
          <div
            class="h-full lg_h-24 flex flex-col justify-center items-center lg_rounded-xl gapy-y-1 lg_gap-y-1.5 lg_bg-white/5"
          >
            <span class="text-xs md_text-base text-gray-500">Claimed</span>
            <div class="text-xl lg_text-2xl font-light">${this.account ? this.stat.claimed : '-'}</div>
          </div>
        </div>
      </div>
      <!-- <div class="w-full h-full bg-yellow-700/50">Profile Page</div> -->
      <div class="mt-6 lg_mt-14">
        <div class="w-full inline-flex pb-2 border-b border-slate-50/10">
          <div class="py-1.5 px-3 text-base font-normal text-white/70 rounded-md">Voted</div>
        </div>
        <user-votes-list by="id"></user-votes-list>
      </div>
    </div>`
  }
}
