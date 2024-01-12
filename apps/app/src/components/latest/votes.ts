import { ThemeElement, customElement, html, property, repeat, state, when } from '@riffian-web/ui/shared/theme-element'
import '@riffian-web/ui/loading/skeleton'

import { latestVote } from './actions'
import { formatUnits } from 'ethers'
import style from './votes.css?inline'
import { asyncReplace } from 'lit/directives/async-replace.js'
// components
import '@riffian-web/ui/address'

@customElement('latest-votes')
export class LatestVotes extends ThemeElement(style) {
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
      let result = await latestVote(14)
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
        ret = ''
      // if (days > 0) ret += days.toString() + (days < 7 ? 'd ' : 'days ')

      if (days > 0)
        ret +=
          days < 2 ? `${days.toString()}d ` : days > 14 ? '2 weeks ' : days < 7 ? `${days.toString()} days ` : `7 days `

      if (days < 7) {
        const hours = (timeAgo - days * 86400n) / 3600n,
          minutes = (timeAgo - days * 86400n - hours * 3600n) / 60n
        if (hours > 0) days < 2 ? (ret += +hours.toString() + 'h ') : ''
        if (minutes > 0) days < 2 ? (ret += minutes.toString() + 'm ') : ''
      }
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
        html`<ul role="ui-list hover gap-2">
          <li class="flex header">
            <div class="w-16">Bidders</div>
          </li>
          ${repeat(
            this.latestVotes,
            (item: any, i) =>
              html`<li class="my-4 py-0.5 justify-start">
                <div class="relative flex items-center justify-between gap-2">
                  <ui-link href=${`/user/${item.voter.address}`}>
                    <ui-address class="text-xl" .address=${item.voter.address} avatar hideAddr></ui-address>
                  </ui-link>
                  <div class="flex flex-col justify-center items-end">
                    <p class="opacity-95 text-base">${formatUnits(item.value, 18)}</p>
                    <p class="text-right text-xs leading-none text-neutral-400 whitespace-nowrap">
                      ${asyncReplace(this.timeAgo(BigInt(item.time)))}
                    </p>
                  </div>
                </div>
              </li> `
          )}
        </ul>`
    )} `
  }
}
