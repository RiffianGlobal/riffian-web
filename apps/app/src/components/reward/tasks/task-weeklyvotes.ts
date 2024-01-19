import { bridgeStore, assignOverrides } from '@riffian-web/ethers/src/useBridge'
import { txReceipt } from '@riffian-web/ethers/src/txReceipt'
import { nowTs } from '@riffian-web/ethers/src/utils'
import { StateController, type UserWeekly, rewardStore, rewardTasks } from '~/store/reward'
import { weeklyStore } from '~/store/weekly'
// Components
import { ThemeElement, html, customElement, repeat, state, when, property } from '@riffian-web/ui/shared/theme-element'
import '../claim'
import '@riffian-web/ui/button'
import '@riffian-web/ui/link'
import '@riffian-web/ui/loading/skeleton'

import { toast, getAlbumContract } from '~/lib/riffutils'

// Style
import style from './task-weeklyvotes.css?inline'

@customElement('task-weeklyvotes')
export class TaskWeeklyvotes extends ThemeElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)
  bindWeekly: any = new StateController(this, weeklyStore)

  @property() reward?: any

  @state() txs: Record<number, any> = {}
  @state() pendings: Record<number, any> = {}

  claim = async (weekly: UserWeekly) => {
    const { week } = weekly
    this.pendings = { ...this.pendings, [week]: true }
    const contract = await getAlbumContract()
    const method = 'claimReward'
    const overrides = {}
    const parameters = [week]
    try {
      await assignOverrides(overrides, contract, method, parameters)
      const call = contract[method](...parameters)
      const tx = (this.txs[week] = new txReceipt(call, {
        errorCodes: 'MediaBoard',
        allowAlmostSuccess: true,
        seq: {
          type: 'claim-weekly-rewards',
          title: `Claim Weekly Rewards`,
          ts: nowTs(),
          overrides
        }
      }))
      await tx.wait()
      rewardStore.update()
    } catch (err: any) {
      if (err.code !== 4001) {
        toast.add({ summary: 'Claim failed', detail: err.message })
      }
    } finally {
      delete this.pendings[week]
      delete this.txs[week]
      this.pendings = { ...this.pendings }
      this.txs = { ...this.txs }
    }
  }

  render() {
    return html`
      <p class="text-center mb-8">Weely Rewards</p>
      <ul class="ui-list bordered hover">
        <li class="header">
          <p class="w-20">Week</p>
          <p class="w-10 text-right">Votes</p>
          <p class="grow text-right">Amount</p>
          <p class="w-20 text-right"></p>
        </li>
        ${repeat(
          rewardStore.userWeeklyRewards,
          (weekly, i) =>
            html`<li class="flex w-full gap-4">
              <p class="w-20">
                <span class="inline-block w-[1.5em]">${weekly.cooked.weekOrdinal}</span>
                ${when(weekly.cooked.pastYear, () => html`<q class="q">${weekly.cooked.year}</q>`)}
              </p>
              <p class="w-10 text-right">${weekly.votes}</p>
              <p class="grow text-right">${weekly.cooked.reward}</p>
              <p class="w-20 text-right">
                <ui-button
                  class="min-w-16"
                  @click=${() => this.claim(weekly)}
                  ?disabled=${!weekly.cooked.claimable}
                  ?pending=${this.pendings[weekly.week]}
                  xs
                  ?text=${!weekly.cooked.past}
                  >${when(
                    weekly.cooked.past,
                    () => (weekly.cooked.claimable ? 'Claim' : 'Claimed'),
                    () => html`<span class="text-green-500">${weeklyStore.latestLeft}</span>`
                  )}</ui-button
                >
              </p>
            </li>`
        )}
      </ul>
      <!-- Initializing -->
      ${when(!rewardStore.inited, () => html`<li><loading-skeleton num="3"></loading-skeleton></li>`)}
      <!-- No data -->
      ${when(!rewardStore.userWeeklyRewards.length, () => html`<p class="mt-4 text-center">No votes yet</p>`)}
    `
  }
}
