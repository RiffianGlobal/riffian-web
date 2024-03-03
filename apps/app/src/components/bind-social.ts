import { ThemeElement, customElement, html, when, state, classMap } from '@riffian-web/ui/shared/theme-element'
import { walletStore } from '@riffian-web/ethers/src/wallet'
import { bindSocial } from '~/components/createAlbum/action'
import { rewardStore } from '~/store/reward'
import { StateController, tweetStore, type Social, genGid, genTweetURI } from '~/store/tweet'
import { Official, Domain, Subject } from '~/constants'
import tweetImg from '~/assets/tweet.png?inline'
// Components
import '@riffian-web/ui/button'
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/loading/icon'
import '@riffian-web/ui/link'
import '@riffian-web/ui/tip'
import '@riffian-web/ui/input/textarea'
import '@riffian-web/ui/tx-state'
import { toast } from '@riffian-web/ui/toast'

export const genTweet = async () => `Get ${
  rewardStore.taskHumanized.tweet ?? 100
} $DOID at ${Domain} ${Official} ${Subject}
Gid: ${genGid(walletStore.account)}`

@customElement('bind-social')
export class BindSocial extends ThemeElement('') {
  bindTweets: any = new StateController(this, tweetStore)
  bindWallet: any = new StateController(this, walletStore)
  bindStore: any = new StateController(this, rewardStore)

  @state() url = ''
  @state() platform = 'twitter'
  @state() pending = false
  @state() success = false
  @state() tx: any = null
  @state() ts = 0

  @state() tweetURI: string | undefined
  @state() twitter: Social | undefined
  @state() inputURL = ''
  @state() inputErr = ''
  @state() inputPending = false
  @state() inChangeMode = false

  connectedCallback() {
    super.connectedCallback()
    this.check()
  }

  check = async () => {
    const reqs = [genTweetURI(await genTweet()), tweetStore.fetchSelf()]
    const [uri] = await Promise.all(reqs)
    this.tweetURI = uri
    this.ts++
  }

  get account() {
    return walletStore.account
  }
  get bound() {
    return this.ts && tweetStore.selfValid
  }
  get inputValid() {
    return !this.inputErr && this.inputURL && !this.inputPending
  }
  get txPending() {
    return this.tx && !this.tx.ignored
  }
  get btnPending() {
    return this.pending || this.txPending
  }
  get btnDisabled() {
    return !this.inputValid || this.btnPending
  }
  get txt() {
    const title = `${this.bound ? (this.inChangeMode ? 'Change' : 'Your') : 'Bind'} Social Account`
    return {
      title,
      btn: `${this.bound ? 'Change' : 'Confirm'}`
    }
  }
  get twitterShow() {
    if (!this.twitter) return ''
    const { name, id } = this.twitter
    return html`<b>${name}</b> @${id}`
  }

  onInput = async (e: CustomEvent) => {
    this.inputURL = e.detail
    this.inputErr = ''
    this.tx = null
    this.inputPending = true
    await this.validate()
    this.inputPending = false
  }

  validate = async () => {
    if (!this.inputURL) return
    try {
      new URL(this.inputURL)
    } catch {
      this.inputErr = 'Invalid URL'
    }
    if (this.inputErr) return
    this.twitter = await tweetStore.fromUri(this.inputURL, this.account)
    if (this.twitter?.address != this.account) this.inputErr = 'Malformed Tweet'
  }

  async set() {
    this.pending = true
    try {
      this.tx = await bindSocial(this.platform, '', this.inputURL)
      this.success = await this.tx.wait()
      await this.check()
      this.tx = null
      if (rewardStore.socialNotClaimed) await rewardStore.update()
      this.inChangeMode = false
    } catch (err: any) {
      if (err.code !== 4001) {
        toast.add({ summary: 'Error', detail: err.message })
      }
    } finally {
      this.pending = false
    }
  }

  chg = () => {
    this.inChangeMode = true
  }
  cancel = () => {
    this.inChangeMode = false
  }
  back = () => {
    this.emit('back')
  }

  render() {
    if (!this.ts) return html`<loading-icon type="block"></loading-icon>`
    return html`
      <h5 class="text-base text-center mt-3 mb-8">${this.txt.title}</h5>
      <!-- Bound info -->
      ${when(
        this.bound && !this.inChangeMode,
        () =>
          html`<div class="my-8 text-center">
              ${when(
                tweetStore.selfValid,
                () =>
                  html`<p class="text-lg">${tweetStore.selfTwitter.name}</p>
                    <p><ui-link href=${tweetStore.selfTwitter.url}>@${tweetStore.selfTwitter.id}</ui-link></p>`,
                () =>
                  html`<div class="w-96 mx-auto text-base">
                    <p class="m-4"><i class="text-3xl mdi mdi-alert text-orange-600"></i></p>
                    <p>
                      <ui-link open href=${tweetStore.selfTweetURI}>The tweet you set</ui-link> seems like in abnormal
                      state, please change to another one.
                    </p>
                  </div>`
              )}
            </div>
            <p class="text-center">
              <ui-link link text class="opacity-70 text-xs" @click=${this.chg}>Change</ui-link>
            </p>
            ${when(
              rewardStore.socialNotClaimed && tweetStore.selfValid,
              () =>
                html`<p class="mt-8 text-center">
                  <a @click=${this.back} class="text-base hover_underline ui-em cursor-pointer"
                    >You can claim your <b class="text-lg ui-em">${rewardStore.taskHumanized.tweet}</b> rewards now
                    <i class="text-base mdi mdi-arrow-right"></i
                  ></a>
                </p>`
            )} `,
        // Set sns url
        () =>
          html`<!-- Step 1 -->
            <div>
              <h6 class="">
                1.
                <ui-link link class="text-base" href=${this.tweetURI}
                  >Post a pre-formatted tweet<i class="mx-1 mdi mdi-open-in-new"></i
                ></ui-link>
                with your address.
              </h6>
            </div>
            <!-- Step 2 -->
            <div class="mt-4 pt-4 border-t border-dashed border-gray-700">
              <h6 class="-mb-2">2. Enter the tweet URL you just posted:</h6>
              <div class="flex justify-between items-center gap-3 mx-3">
                <div class="grow">
                  <ui-input-text
                    .value=${this.inputURL}
                    @input=${this.onInput}
                    ?readonly=${this.pending || this.inputPending}
                    placeholder="eg. https://twitter.com/your_id/status/123"
                  >
                    <span slot="label"></span>
                    <span slot="msg" class="${classMap({ 'text-red-500': this.inputErr })}"
                      >${this.inputErr ||
                      html`<ui-tip
                        ><ui-link slot="button">How to find?</ui-link>
                        <img-loader .src=${tweetImg} class=""></img-loader>
                      </ui-tip>`}</span
                    >
                    <span slot="right"
                      ><i
                        class="mdi ${classMap({
                          'mdi-loading': this.inputPending,
                          'mdi-check': this.inputValid
                        })}"
                      ></i
                    ></span>
                  </ui-input-text>
                </div>
                <div class="grow-0"></div>
              </div>
            </div>
            <!-- Actions -->
            <p class="mt-6 relative flex gap-4 justify-center items-center">
              <ui-button @click=${this.set} ?disabled=${this.btnDisabled} ?pending=${this.btnPending}
                >Confirm<i class="mdi ${classMap({ 'mdi-loading': this.txPending })}"></i
              ></ui-button>
              ${when(
                this.inChangeMode,
                () =>
                  html`<ui-link @click=${this.cancel} ?disabled=${this.btnPending} class="absolute -mt-1.5 -mr-32"
                    >Cancel</ui-link
                  >`
              )}
            </p>`
      )}
    `
  }
}
