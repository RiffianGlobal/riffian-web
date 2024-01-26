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
import '@riffian-web/ui/loading/skeleton'

import { screenStore } from '@lit-web3/base/screen'
import { latestVote } from './actions'
import { formatUnits } from 'ethers'
import style from './votes.css?inline'
import { asyncReplace } from 'lit/directives/async-replace.js'
import { timeAgo } from '~/lib/dayjs'
// components
import '@riffian-web/ui/address'

@customElement('latest-votes')
export class LatestVotes extends ThemeElement(style) {
  @property({ type: Boolean }) weekly = false
  @state() latestVotes = []
  @state() albumToVote = { id: '', voter: 0, time: 0, value: 0 }
  @state() pending = false

  get isMobi() {
    return screenStore.screen.isMobi
  }

  get skeletonLen() {
    return this.isMobi ? 2 : 3
  }

  connectedCallback() {
    super.connectedCallback()
    this.init()
  }

  init = async () => {
    this.pending = true
    try {
      let result = await latestVote(12)
      this.latestVotes = result.voteLogs
    } catch (e: any) {
      console.error(e)
    } finally {
      this.pending = false
    }
  }

  timeAgo = async function* (timestamp: number | string) {
    while (true) {
      yield timeAgo(timestamp)
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  render() {
    return html` <div role="list" class="ui-list bidders ${classMap(this.$c([this.pending ? 'loading' : 'hover']))}">
      <div class="flex header border-bottom"><div class="w-full">Bidders</div></div>
      ${when(
        this.pending && this.latestVotes.length == 0,
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
            this.latestVotes,
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
