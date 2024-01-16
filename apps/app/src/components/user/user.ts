import { ThemeElement, customElement, html, property, state, when } from '@riffian-web/ui/shared/theme-element'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import { formatUnits } from 'ethers'
import '~/components/top/dialog'
import { user } from './action'
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/img/loader'
import '@riffian-web/ui/dialog/prompt'
import { tweetStore, type Social } from '~/components/top/tweet'
import style from './user.css?inline'

const defErr = () => ({ loading: '', tx: '' })

@customElement('user-detail')
export class TrackDetail extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindTweets: any = new StateController(this, tweetStore)
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

  get disabled() {
    return !bridgeStore.bridge.account
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
    const social = await tweetStore.get(uri)
    if (social) Object.assign(social, { verified: this.user.address })
    this.social = social
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
    return html`<div class="m-4 text-center">
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
                <div class="mt-4">
                  ${when(
                    this.social?.verified,
                    () =>
                      html`<span class="text-base font-light middle-dot-divider"
                        >${this.social?.name}<span class="ml-0.5"
                          ><i class="text-green-600 text-sm mdi mdi-check-decagram"></i></span
                      ></span>`
                  )}
                  ${when(
                    this.social?.url,
                    () => html`
                      <span class="text-base font-light">
                        <a href="${this.social?.url}" class="text-blue-300" target="_blank">@${this.social?.id}</a>
                      </span>
                    `
                  )}
                </div>
                <div class="mt-0.5">
                  <span class="text-base text-white/70 middle-dot-divider"
                    >Holding <span class="ml-1 text-blue-300">${this.user.holding ?? '-'}</span></span
                  >
                  <span class="text-base text-white/70"
                    >Reward Claimed
                    <span class="ml-1 text-blue-300"
                      >${this.user.rewardClaimed ? (+formatUnits(this.user.rewardClaimed)).toFixed(4) : '-'}</span
                    ></span
                  >
                </div>
              </div>`
          )}`
      )}
    </div>`
  }
}
