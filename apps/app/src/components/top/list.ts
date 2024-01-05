import {
  TailwindElement,
  classMap,
  customElement,
  html,
  property,
  repeat,
  state,
  when
} from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '~/components/top/dialog'
import { albumList, weekList } from './action'
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'
import '@riffian-web/ui/src/img/loader'
import '@riffian-web/ui/src/dialog/prompt'
import '~/components/rewards/claim'
import emitter from '@riffian-web/core/src/emitter'

import style from './list.css?inline'
import { getWeek } from '../rewards/action'
import { formatUnits } from 'ethers'
@customElement('top-album')
export class TopAlbum extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) weekly = false
  @state() subjectList: any
  @state() showAlbumVote = false
  @state() albumToVote = { id: '', supply: 0, url: '', name: '', creator: { address: '' }, uri: '', image: '' }
  @state() pending = false
  @state() prompt = false
  @state() promptMessage: string = ''

  get disabled() {
    return !bridgeStore.bridge.account
  }

  connectedCallback() {
    super.connectedCallback()
    this.init()
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
  }

  init = async () => {
    this.pending = true
    try {
      let result = this.weekly ? await weekList(10, await getWeek()) : await albumList(10)
      this.subjectList = this.weekly ? result.subjectWeeklyVotes : result.subjects
    } catch (e: any) {
      console.error(e)
      this.promptMessage = e
      this.prompt = true
      return
    }
    this.pending = false

    let urls = [
      'https://cdn.shopify.com/app-store/listing_images/a82167e02b45cadf681efc6c17c35f3a/icon/CMmMjb30lu8CEAE=.jpg'
    ]
    for (var i = 0; i < this.subjectList.length; i++) {
      if (this.weekly) {
        let weekResult = this.subjectList[i]
        this.subjectList[i] = weekResult.subject
        this.subjectList[i].volumeTotal = weekResult.volumeTotal
      }
      if (!this.subjectList[i].image || !this.subjectList[i].image.startsWith('http')) {
        this.subjectList[i].image = urls[0]
      }
    }
  }

  close = () => {
    this.showAlbumVote = false
    this.init()
  }

  static dayChange(item: any) {
    if (item.voteLogs.length == 0) {
      return 'New'
    } else {
      let before = item.voteLogs[0].supply,
        end = item.supply,
        diff = Math.abs(before - end),
        change = ((diff * 100.0) / before).toFixed(1)
      if (before > end) return html`<p class="text-red-500 ">-${change}%</p>`
      else return html`<p class="text-green-500 ">+${change}%</p>`
    }
  }

  render() {
    return html`<div>
        ${when(
          this.pending && !this.subjectList,
          () =>
            html`<div name="Loading" class="doc-intro">
              <div class="flex flex-col gap-8 m-8">
                <loading-skeleton num="3"></loading-skeleton>
                <loading-skeleton num="3"></loading-skeleton>
                <loading-skeleton num="3"></loading-skeleton>
              </div>
            </div>`
        )}
        ${when(
          this.subjectList,
          () =>
            html`<ul role="list">
                <li class="flex header p-1">
                  <div class="w-16">Rank</div>
                  <div class="flex-auto">Collection</div>
                  <div class="flex-auto text-right pr-3">${this.weekly ? 'Volume' : 'Price'}</div>
                  <div class="flex-none w-16 text-right">24H</div>
                  ${when(
                    this.pending,
                    () =>
                      html`<div>
                        <i class="text-sm mdi mdi-loading"></i>
                        <div></div>
                      </div>`
                  )}
                </li>
                ${repeat(
                  this.subjectList,
                  (item: any, i) =>
                    html`<li
                      class="item flex py-2 items-center cursor-pointer"
                      @click=${() => {
                        if (this.disabled) {
                          emitter.emit('connect-wallet')
                        } else {
                          this.albumToVote = item
                          // this.showAlbumVote = true
                          location.href = '/track/' + item.id
                        }
                      }}
                    >
                      <div class="flex-none w-16 pl-4 text-sm font-light opacity-75">${i + 1}</div>
                      <div class="flex-initial flex">
                        <div class="w-[3.75rem] h-[3.75rem] mr-4 rounded-lg">
                          <img-loader .src=${item.image} class="rounded-lg"></img-loader>
                        </div>
                        <div>
                          <p class="name truncate mt-2">${item.name}</p>
                          <span class="icon mt-1"><i class="mdi mdi-play-circle-outline"></i></span>
                        </div>
                      </div>
                      <div class="flex-auto text-right pr-3">
                        <p class="text-sm">
                          ${this.weekly ? formatUnits(item.volumeTotal, 18) : (Number(item.supply) + 1) / 10}
                        </p>
                      </div>
                      <div class="flex-none w-16 text-right text-sm" style="color: #34C77B">
                        ${TopAlbum.dayChange(item)}
                      </div>
                    </li> `
                )}
              </ul>
              ${when(
                this.showAlbumVote,
                () =>
                  html`<vote-album-dialog
                    album=${this.albumToVote.id}
                    url=${this.albumToVote.image}
                    name=${this.albumToVote.name}
                    votes=${this.albumToVote.supply}
                    author=${this.albumToVote.creator.address}
                    @close=${this.close}
                  ></vote-album-dialog>`
              )} `
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p> `)}`
  }
}
