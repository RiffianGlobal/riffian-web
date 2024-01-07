import {
  bridgeStore,
  assignOverrides,
  getSigner,
  getAccount,
  getContracts,
  getNetwork
} from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore, getRewardContract } from './store'
import { normalizeTxErr } from '@riffian-web/ethers/src/parseErr'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { emitter } from '@lit-web3/base'
import { getSocials } from '~/components/createAlbum/action'
import { nowTs } from '@riffian-web/ethers/src/utils'
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

// Style
import { coinSvg } from './icon'
import style from './btn.css?inline'

@customElement('reward-claim')
export class RewardClaim extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)

  @property() reward?: any

  @state() pending = false
  @state() _claimable = false
  @state() tx: any = null

  get txPending() {
    return this.tx && !this.tx.ignored
  }
  get isSocial() {
    return this.reward.key === 'social'
  }
  get claimable() {
    return this.reward.claimable
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
      const res = await contract[this.reward.write]()
      console.log(res)
      rewardStore.update()
    } catch (err: any) {
      err = await normalizeTxErr(err)
      console.log(err)
      if (err.code !== 4001) {
        this.emit('error', err.message)
        throw err
      }
    } finally {
      this.pending = false
    }
  }

  bindSocial = () => {
    emitter.emit('ui-bindsocial')
    setTimeout(() => this.emit('close'), 300)
  }

  async connectedCallback() {
    super.connectedCallback()
    rewardStore.update()
    // TODO: move to user profile store
    this._claimable = this.isSocial ? (await getSocials()).length : true
  }

  render() {
    return html`
      <!-- Claim -->
      <ui-button
        @click=${this.claim}
        .disabled=${!this.claimable}
        .pending=${this.pending || this.txPending}
        class="outlined"
        text
        xs
        >${this.claimable || !this.isSocial ? 'Claim' : 'Claimed'}</ui-button
      >
    `
  }
}
