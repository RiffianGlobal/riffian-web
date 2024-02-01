import { bridgeStore, assignOverrides, getAccount, getNetwork } from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore } from '~/store/reward'
import { tweetStore } from '~/store/tweet'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { getSocials } from '~/components/createAlbum/action'
import { userVotes } from '~/components/uservotes/action'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { getRewardContract } from '~/lib/riffutils'
import { http } from '@lit-web3/base'
// Components
import {
  ThemeElement,
  html,
  customElement,
  state,
  classMap,
  property,
  when
} from '@riffian-web/ui/shared/theme-element'
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/button'
import '@riffian-web/ui/dialog'

// Style
import style from './claim.css?inline'

@customElement('reward-claim')
export class RewardClaim extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)
  bindTweet: any = new StateController(this, tweetStore)

  @property() reward?: any

  @state() pending = false
  @state() _claimable = false
  @state() tx: any = null
  @state() votesDialog = false

  get txPending() {
    return this.tx && !this.tx.ignored
  }
  get isSocial() {
    return this.reward.key === 'social'
  }
  get isVotes() {
    return this.reward.key === 'votes'
  }
  get claimed() {
    return this.reward.claimed
  }
  get claimable() {
    if (this.isSocial) {
      if (!tweetStore.selfValid) return true // Both unbound & notClaimed
      if (rewardStore.socialNotClaimed) return true
    }
    return this._claimable && !this.reward.claimed && !this.reward.closed
  }
  get processing() {
    return this.pending || this.txPending
  }
  get claimBtnTxt() {
    if (this.reward.closed) return '-'
    if (this.isSocial && !tweetStore.selfValid) return 'Bind'
    return this.claimed ? 'Claimed' : 'Claim'
  }

  personalSign = async (acc: string) => {
    const params = { acc }
    const [, chain = ''] = (await getNetwork()).name.match(/(\w+)$/) ?? []
    if (chain) Object.assign(params, { chain })
    const { sig } = await http.get(`https://svc.riffian.global/api/sign`, params)
    return sig
  }

  claim = async () => {
    if (this.isSocial && (!this._claimable || !tweetStore.selfValid)) return this.bindSocial()
    if (this.isVotes) return this.claimVotes()
    this.pending = true
    try {
      const [contract, account] = await Promise.all([getRewardContract(), getAccount()])

      const [method, overrides] = [this.reward.write, {}]
      const parameters: any[] = []
      if (this.reward.requireSig) parameters.push(await this.personalSign(account))
      if (['share', 'follow'].includes(this.reward.key)) parameters.unshift(account)
      await assignOverrides(overrides, contract, method, parameters)
      const call = contract[method](...parameters)
      this.tx = new txReceipt(call, {
        errorCodes: 'Reward',
        seq: {
          type: 'Claim',
          title: `Claim`,
          ts: nowTs(),
          overrides
        }
      })
      await this.tx.wait()
      rewardStore.update()
    } catch (err: any) {
      if (err.code !== 4001) {
        this.emit('error', err.message)
        console.error(err)
      }
    } finally {
      this.pending = false
    }
  }

  // TODO: seperate to sub elements
  // claimWeekly = async () => {
  //   const contract = await getAlbumContract()
  //   const method = 'claimReward'
  //   const overrides = {}
  //   const parameters = [getWeek()]
  //   await assignOverrides(overrides, contract, method, parameters)
  //   const call = contract[method](...parameters)

  //   return new txReceipt(call, {
  //     errorCodes: 'MediaBoard',
  //     allowAlmostSuccess: true,
  //     seq: {
  //       type: 'ClaimAlbumRewards',
  //       title: `Claim Album Rewards`,
  //       ts: nowTs(),
  //       overrides
  //     }
  //   })
  // }

  bindSocial = () => {
    this.emit('scene', 'social')
    // Old
    // emitter.emit('ui-bindsocial')
    // setTimeout(() => this.emit('close'), 300)
  }
  claimVotes = () => {
    this.votesDialog = true
  }
  closeVotesDialog = () => {
    this.votesDialog = false
  }

  async connectedCallback() {
    super.connectedCallback()
    rewardStore.update()
    // TODO: move to user profile store
    switch (this.reward.key) {
      case 'social':
        this._claimable = (await getSocials()).length
        break
      case 'vote':
        this._claimable = (await userVotes()).length
        break
      default:
        this._claimable = true
    }
  }

  render() {
    return html`
      <div class="flex w-full justify-between items-center ${classMap({ 'text-gray-600': this.reward.closed })}">
        <!-- Name -->
        <span
          >${this.reward.title}
          ${when(this.isSocial, () => html`<ui-link @click=${this.bindSocial} icon sm>view</ui-link>`)}
        </span>
        <div class="flex gap-2 items-center text-right">
          <!-- Amnt -->
          <span class="${classMap({ 'text-green-600': +this.reward.amnt > 0, 'font-bold': +this.reward.amnt > 0 })}"
            >${this.reward.closed || this.claimed ? '' : this.reward.amnt}</span
          >
          <!-- Button -->
          <div class="flex justify-end items-center w-[6em] h-[2em]">
            <ui-button
              @click=${this.claim}
              .disabled=${!this.claimable || this.reward.closed}
              .pending=${this.processing}
              class="min-w-16"
              ?text=${this.reward.closed}
              xs
              >${when(
                this.processing,
                () => html`<i class="mdi mdi-loading"></i>`,
                () => html`${this.claimBtnTxt}`
              )}</ui-button
            >
            <!-- Icon -->
            ${when(
              this.isVotes,
              () =>
                html`<ui-button class="min-w-16" icon sm ?disabled=${this.claimed}
                  ><i
                    class="mdi ${classMap({
                      'mdi-chevron-right text-xl': this.isVotes,
                      'mdi-check': this.claimed && !this.reward.closed
                    })}"
                  ></i
                ></ui-button>`
            )}
          </div>
        </div>
      </div>
      <!-- Votes Dialog -->
      ${when(this.votesDialog, () => html`<claim-reward-dialog @close=${this.closeVotesDialog}></claim-reward-dialog>`)}
    `
  }
}
