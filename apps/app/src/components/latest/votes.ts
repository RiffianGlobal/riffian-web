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
      console.log(result)
      this.latestVotes = result.voteLogs
    } catch (e: any) {
      console.error(e)
    }
    console.log(this.latestVotes)
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
      <ul role="list">
        ${repeat(
          this.latestVotes,
          (item: any, i) =>
            html`<li class="py-2 justify-end">
              <div class="flex items-center justify-end space-x-2">
                <ui-address class="text-xl" .address=${item.voter.address} avatar hideAddr></ui-address>
                <p class="text-highlight text-2xl">${formatUnits(item.value, 18)}</p>
              </div>
              <div>
                <p class="font-light text-gray-400 text-right text-sm">
                  ${asyncReplace(this.timeAgo(BigInt(item.time)))}
                </p>
              </div>
            </li> `
        )}
      </ul>`
  }
}
