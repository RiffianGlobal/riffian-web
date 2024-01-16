import {
  bridgeStore,
  assignOverrides,
  getSigner,
  getAccount,
  getContracts,
  getNetwork
} from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore } from './store'
import { normalizeTxErr } from '@riffian-web/ethers/src/parseErr'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { emitter } from '@lit-web3/base'
import { getSocials } from '~/components/createAlbum/action'
import { userVotes } from '~/components/uservotes/action'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { getRewardContract } from '~/lib/riffutils'
// Components
import {
  ThemeElement,
  html,
  customElement,
  state,
  classMap,
  repeat,
  property,
  when
} from '@riffian-web/ui/shared/theme-element'
import '@riffian-web/ui/input/text'
import '@riffian-web/ui/button'
import '@riffian-web/ui/dialog'
import '~/components/referral/bind'
import { toast } from '@riffian-web/ui/toast'

// Style
import style from './claim.css?inline'

@customElement('reward-claim')
export class RewardClaim extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)

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
    if (this.isSocial && rewardStore.socialNotClaimed) return true
    return this.reward.claimable && !this.reward.claimed && !this.reward.closed
  }
  get processing() {
    return this.pending || this.txPending
  }
  get claimBtnTxt() {
    if (this.reward.closed) return '-'
    if (this.isSocial) return 'Bind'
    return this.claimed ? 'Claimed' : 'Claim'
  }

  personalSign = async () => {
    const [signer, { chainId }] = [await getSigner(), await getNetwork()]
    return await signer.signTypedData(
      { name: 'RiffianAirdrop', version: '1.0.0', chainId, verifyingContract: getContracts('Reward') },
      { Account: [{ name: 'account', type: 'address' }] },
      { account: await getAccount() }
    )
  }

  claim = async () => {
    if (this.isSocial && !this._claimable) return this.bindSocial()
    if (this.isVotes) return this.claimVotes()
    this.pending = true
    try {
      const contract = await getRewardContract()

      const [method, overrides] = [this.reward.write, {}]
      const parameters: any[] = []
      if (this.reward.key !== 'vote') parameters.push(await this.personalSign())
      if (['share', 'follow'].includes(this.reward.key)) parameters.unshift(await getAccount())
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
      await rewardStore.update()
    } catch (err: any) {
      err = await normalizeTxErr(err)
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
    emitter.emit('ui-bindsocial')
    setTimeout(() => this.emit('close'), 300)
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
          ${when(
            this.isSocial,
            () =>
              html`<ui-button @click=${this.bindSocial} icon sm
                ><i class="i mdi mdi-twitter text-blue-500"></i
              ></ui-button>`
          )}
        </span>
        <div class="flex gap-2 items-center text-right">
          <!-- Amnt -->
          <span class="${classMap({ 'text-green-600 font-bold': +this.reward.amnt > 0 })}"
            >${this.reward.closed || this.claimed ? '' : this.reward.amnt}</span
          >
          <!-- Button -->
          <div class="flex justify-end items-center w-[6em] h-[2em]">
            <ui-button
              @click=${this.claim}
              .disabled=${!this.claimable || this.reward.closed}
              .pending=${this.processing}
              class=""
              text
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
                html`<ui-button icon sm ?disabled=${this.claimed}
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
