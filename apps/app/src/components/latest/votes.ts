import {
  TailwindElement,
  customElement,
  html,
  property,
  repeat,
  state,
  when
} from '@riffian-web/ui/src/shared/TailwindElement'
import '@riffian-web/ui/src/loading/skeleton'

import { latestVote } from './actions'
import { formatUnits } from 'ethers'
import style from './votes.css?inline'
import { asyncReplace } from 'lit/directives/async-replace.js'
// components
import '@riffian-web/ui/src/address'

@customElement('latest-votes')
export class LatestVotes extends TailwindElement(style) {
  @property({ type: Boolean }) weekly = false
  @state() latestVotes = []
  @state() albumToVote = { id: '', voter: 0, time: 0, value: 0 }
  @state() pending = false

  connectedCallback() {
    super.connectedCallback()
    this.init()
  }

  init = async () => {
    this.pending = true
    try {
      let result = await latestVote(20)
      this.latestVotes = result.voteLogs
    } catch (e: any) {
      console.error(e)
    }
    this.pending = false
  }

  timeAgo = async function* (timestamp: bigint) {
    while (true) {
      let tsNow = BigInt(new Date().getTime()) / 1000n,
        timeAgo = tsNow - timestamp,
        days = timeAgo / 86400n,
        hours = (timeAgo - days * 86400n) / 3600n,
        minutes = (timeAgo - days * 86400n - hours * 3600n) / 60n,
        ret = ''
      if (days > 0) ret += days.toString() + 'd '
      if (hours > 0) ret += +hours.toString() + 'h '
      if (minutes > 0) ret += minutes.toString() + 'm '
      if (!ret) ret = '<1m'
      else ret += 'ago'
      yield ret
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  render() {
    return html`${when(
      this.pending && this.latestVotes.length == 0,
      () => html`<loading-skeleton num="4"></loading-skeleton>`
    )}
    ${when(
      !this.pending,
      () =>
        html`<ul role="list">
          <li class="flex header p-1 lg_mt-8">
            <div class="w-16">Bidders</div>
          </li>
          ${repeat(
            this.latestVotes,
            (item: any, i) =>
              html`<li class="py-2 justify-start">
                <div class="flex items-top justify-between space-x-2">
                  <ui-address class="text-2xl" .address=${item.voter.address} avatar hideAddr></ui-address>
                  <div class="flex flex-col justify-center items-end">
                    <p class="opacity-95 text-base">${formatUnits(item.value, 18)}</p>
                    <p class="text-left text-xs text-neutral-400">${asyncReplace(this.timeAgo(BigInt(item.time)))}</p>
                  </div>
                </div>
              </li> `
          )}
        </ul>`
    )} `
  }
}
