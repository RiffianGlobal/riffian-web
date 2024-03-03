import { ThemeElement, customElement, html, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { walletStore, StateController } from '@riffian-web/ethers/src/wallet'
import { screenStore } from '@lit-web3/base/screen'
import { formatUnits } from 'ethers'
import '~/components/top/dialog'
import { user } from './action'
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/dialog/prompt'
import { tweetStore, type Social } from '~/store/tweet'
import style from './user.css?inline'

const defErr = () => ({ loading: '', tx: '' })

@customElement('user-detail')
export class TrackDetail extends ThemeElement(style) {
  bindWallet: any = new StateController(this, walletStore)
  bindTweets: any = new StateController(this, tweetStore)
  bindScreen: any = new StateController(this, screenStore)
  @property({ type: Boolean }) weekly = false
  @property({ type: String }) address = ''
  @property({ type: Promise<any> }) votes: Promise<any> | undefined
  @state() myVotes: Promise<any> | undefined
  @state() retreatDisabled = true
  @state() social: Social | undefined
  @state() user: any
  @state() voteList: any = []
  @state() pending = false
  @state() prompt = false
  @state() dialog = false
  @state() promptMessage: string = ''
  @state() err = defErr()
  @state() ts = 0

  get isMobi() {
    return screenStore.screen.isMobi
  }

  get disabled() {
    return !walletStore.account
  }

  connectedCallback() {
    super.connectedCallback()
    this.init()
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  async readFromTwitter() {
    let { uri } = this.user.socials[0] ?? {}
    this.social = await tweetStore.fromUri(uri, this.user.address)
  }

  updateErr = (err = {}) => (this.err = Object.assign({}, this.err, err))
  init = async () => {
    this.pending = true
    try {
      let result = await user(this.address)
      this.user = result.user
      this.readFromTwitter()
    } catch (e: any) {
      this.updateErr({ load: e.message || e })
      this.promptMessage = e
      this.prompt = true
      return
    } finally {
      this.ts++
      this.pending = false
    }
  }

  close = () => {
    this.dialog = false
    this.init()
  }

  render() {
    return html`<div class="mx-2 md_m-4 md_text-center">
      ${when(
        !this.ts && !this.err.loading,
        () =>
          html`<div name="Loading" class="doc-intro">
            <div class="flex flex-col gap-8 m-8">
              <loading-skeleton num="3"></loading-skeleton>
            </div>
          </div>`,
        () =>
          html`${when(
            this.prompt,
            () => html`<p class="text-center text-orange-600">${this.promptMessage}</p>`,
            () =>
              html`<div class="py-4">
                <ui-address class="text-lg" .address="${this.user.address}" short avatar></ui-address>
                <div class="md_my-4">
                  ${when(
                    this.social?.id,
                    () =>
                      html`<span class="text-sm md_text-base font-light middle-dot-divider"
                          >${this.social?.name}<span class="ml-0.5"
                            >${when(
                              this.social?.verified,
                              () => html`<i class="text-green-600 text-sm mdi mdi-check-decagram"></i>`
                            )}</span
                          ></span
                        ><span class="text-sm md_text-base font-light">
                          <a href="${this.social?.url}" class="text-blue-300" target="_blank">@${this.social?.id}</a>
                        </span>`
                  )}
                </div>
                <div class="mt-4 md_mt-0.5 divide-x divide-white/20 md_divide-x-0">
                  <span
                    class="text-white/70 ${this.isMobi
                      ? 'pr-6 inline-flex flex-col items-center'
                      : 'middle-dot-divider'}"
                    ><span class="text-xs md_text-base">Holding</span
                    ><span class="ml-1 text-xl md_text-base text-blue-300">${this.user.holding ?? '-'}</span></span
                  >
                  <span class="text-white/70 ${this.isMobi ? 'pl-6 inline-flex flex-col items-center' : ''}"
                    ><span class="text-xs md_text-base">Reward Claimed</span>
                    <span class="ml-1 text-xl md_text-base text-blue-300"
                      >${this.user.rewardClaimed
                        ? parseFloat((+formatUnits(this.user.rewardClaimed)).toFixed(4))
                        : '-'}</span
                    ></span
                  >
                </div>
              </div>`
          )}`
      )}
    </div>`
  }
}
