import {
  ThemeElement,
  customElement,
  html,
  property,
  repeat,
  state,
  when,
  classMap
} from '@riffian-web/ui/shared/theme-element'
import { screenStore } from '@lit-web3/base/screen'
import { formatUnits } from 'ethers'
import { asyncReplace } from 'lit/directives/async-replace.js'
import { timeAgo } from '~/lib/dayjs'
import { chartsStore, StateController } from '~/store/charts'
// components
import '@riffian-web/ui/loading/skeleton'
import '@riffian-web/ui/address'

import style from './votes.css?inline'
@customElement('latest-votes')
export class LatestVotes extends ThemeElement(style) {
  bindCharts: any = new StateController(this, chartsStore)

  @state() albumToVote = { id: '', voter: 0, time: 0, value: 0 }
  @state() moreVotes = []
  @state() morePending = false

  get isMobi() {
    return screenStore.screen.isMobi
  }
  get skeletonLen() {
    return this.isMobi ? 2 : 3
  }
  get loading() {
    return chartsStore.pending && !chartsStore.votes.length
  }
  get empty() {
    return chartsStore.inited && !chartsStore.votes.length
  }
  get votes() {
    return chartsStore.votes.concat(this.moreVotes)
  }

  timeAgo = async function* (timestamp: number | string) {
    while (true) {
      yield timeAgo(timestamp)
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  render() {
    return html` <div
      role="list"
      class="ui-list bidders ${classMap(this.$c([this.morePending ? 'loading' : 'hover']))}"
    >
      <div class="flex header border-bottom">
        <div class="w-full">Bidders</div>
      </div>
      ${when(
        this.loading,
        () => html`
          <div name="Loading" class="doc-intro">
            <div class="w-full flex flex-col gap-8">
              ${repeat(
                [...Array(this.skeletonLen).keys()],
                () => html`<loading-skeleton num="3" class="${this.isMobi ? '' : 'sm'}"></loading-skeleton>`
              )}
            </div>
          </div>
        `,
        () => html`
          ${repeat(
            this.votes,
            (item: any) =>
              html`<div class="item flex items-center pr-0.5">
                <div class="w-full flex items-center justify-between gap-2">
                  <ui-link href=${`/user/${item.voter.address}`}>
                    <ui-address
                      class="relative -top-1 text-xl"
                      .address=${item.voter.address}
                      avatar
                      hideAddr
                    ></ui-address>
                  </ui-link>
                  <div class="flex flex-col justify-center items-end text-right">
                    <p class="opacity-95 text-base">${formatUnits(item.value)}</p>
                    <p class="relative text-right text-xs leading-none text-neutral-400 whitespace-nowrap h-3">
                      <span class="absolute right-0">${asyncReplace(this.timeAgo(item.time))}</span>
                    </p>
                  </div>
                </div>
              </div>`
          )}
        `
      )}
    </div>`
  }
}
