import {
  TailwindElement,
  classMap,
  customElement,
  html,
  repeat,
  state,
  when
} from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '~/components/top/dialog'
import { albumList } from './action'
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'
import '@riffian-web/ui/src/img/loader'
import '@riffian-web/ui/src/dialog/prompt'
import '~/components/rewards/claim'
import emitter from '@riffian-web/core/src/emitter'

import style from './list.css?inline'
@customElement('top-album')
export class NewAlbum extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() albumList: any
  @state() showAlbumVote = false
  @state() albumToVote = { id: '', votes: 0, url: '', name: '', owner: { account: '' } }
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
      let result = await albumList(10)
      this.albumList = result.subjects
    } catch (e: any) {
      this.promptMessage = e
      this.prompt = true
    }
    console.log(this.albumList)
    this.pending = false

    let urls = [
      'https://m.media-amazon.com/images/M/MV5BMTA5NDBkNzMtNzY3NC00NDhiLWI2OGQtNmU2NGRmMzk3YjdiXkEyXkFqcGdeQXVyMjI0OTk0OTE@._V1_.jpg',
      'https://i1.sndcdn.com/artworks-000329038545-d554xk-t500x500.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/You_Are_Not_Alone.jpg/220px-You_Are_Not_Alone.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLE1c3OU9GZU5Ev_eXLBzyesTY8JOkUulBUw&usqp=CAU',
      'https://upload.wikimedia.org/wikipedia/zh/5/5e/21_Adele_Album.jpg',
      'https://i.kfs.io/album/global/25572377,4v1/fit/500x500.jpg'
    ]
    for (var i = 0; i < this.albumList.length; i++) {
      this.albumList[i].url = urls[this.getRandomInt(4)]
    }
    console.log(this.albumList)
  }

  close = () => {
    this.showAlbumVote = false
    this.init()
  }

  render() {
    return html`<div>
        ${when(
          this.pending && !this.albumList,
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
          this.albumList,
          () =>
            html`<ul role="list">
                <li class="flex header p-1">
                  <div class="w-16">Rank</div>
                  <div class="flex-auto">Collection</div>
                  <div class="w-16">Volume</div>
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
                  this.albumList,
                  (item: any, i) =>
                    html`<li
                      class="flex py-2 item items-center cursor-pointer ${classMap({
                        'bg-zinc-800/50': i % 2
                      })}"
                      @click=${() => {
                        if (this.disabled) {
                          emitter.emit('connect-wallet')
                        } else {
                          this.albumToVote = item
                          this.showAlbumVote = true
                        }
                      }}
                    >
                      <div class="flex-none w-16 pl-4 text-lg font-light">${i + 1}</div>
                      <div class="flex-initial flex">
                        <div class="w-[4.6rem] h-[4.6rem] mr-4">
                          <img-loader sizes="74px, 74px" src=${item.url}></img-loader>
                        </div>
                        <div>
                          <p class="name truncate mt-2">${item.name}</p>
                          <span class="icon mt-1"><i class="mdi mdi-play-circle-outline"></i></span>
                        </div>
                      </div>
                      <div class="flex-auto text-right pr-3">
                        <p class="text-2xl">${item.totalVotes * 18}</p>
                      </div>
                      <div class="flex-none w-16">
                        <p class="text-lg  text-green-500 font-light">${'+' + item.totalVotes + '%'}</p>
                      </div>
                    </li> `
                )}
              </ul>
              ${when(
                this.showAlbumVote,
                () =>
                  html`<vote-album-dialog
                    album=${this.albumToVote.id}
                    url=${this.albumToVote.url}
                    name=${this.albumToVote.name}
                    votes=${this.albumToVote.votes}
                    author=${this.albumToVote.owner.account}
                    @close=${this.close}
                  ></vote-album-dialog>`
              )} `
        )}
      </div>
      <!-- Prompt -->
      ${when(this.prompt, () => html`<p class="text-center text-orange-600">${this.promptMessage}</p> `)}`
  }
}
