import { TailwindElement, customElement, html, repeat, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '~/components/top/dialog'
import { albumList } from './action'
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'
import '~/components/rewards/claim'

@customElement('top-album')
export class NewAlbum extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() albumList: any = []
  @state() dialog = false
  @state() currentAlbum = { address: '', votes: 0, url: '' }
  @state() pending = false

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
    let result = await albumList(10)
    this.albumList = result.albums
    console.log(this.albumList)
    this.pending = false

    let names = ['Beat it', 'You are not alone']
    let urls = [
      'https://i1.sndcdn.com/artworks-000329038545-d554xk-t500x500.jpg',
      'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/You_Are_Not_Alone.jpg/220px-You_Are_Not_Alone.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLE1c3OU9GZU5Ev_eXLBzyesTY8JOkUulBUw&usqp=CAU',
      'https://upload.wikimedia.org/wikipedia/zh/5/5e/21_Adele_Album.jpg',
      'https://i.kfs.io/album/global/25572377,4v1/fit/500x500.jpg'
    ]
    console.log(JSON.stringify(this.albumList))
    for (var i = 0; i < this.albumList.length; i++) {
      this.albumList[i].url = urls[this.getRandomInt(4)]
      this.albumList[i].name = names[this.getRandomInt(2)]
    }
  }

  close = () => (this.dialog = false)

  render() {
    return html` <div class="grid place-items-center b-1 border m-4 p-4 rounded-md">
      ${when(
        this.pending,
        () =>
          html`<div name="Loading" class="doc-intro">
            <div class="flex gap-4">
              <loading-skeleton num="4"></loading-skeleton>
              <loading-skeleton num="4"></loading-skeleton>
              <loading-skeleton num="4"></loading-skeleton>
            </div>
          </div>`
      )}
      ${when(
        !this.pending,
        () =>
          html`<table class="w-1/2 text-left border-collapse">
            <thead>
              <th>Rank</th>
              <th>Collection</th>
              <th>Album</th>
              <th>Vote Amount</th>
              <th>Reward Pool Amount</th>
              <th>Operation</th>
            </thead>
            ${repeat(
              this.albumList,
              (item: any, i) =>
                html`<tr>
                  <td
                    class="py-2 pr-2 font-mono font-medium text-lg leading-6 text-sky-500 whitespace-nowrap dark:text-sky-400"
                  >
                    ${i + 1}
                  </td>
                  <td><img class="w-24 h-24 rounded-md" src=${item.url} /></td>
                  <td class="py-2 pl-2 font-mono text-sm leading-6 text-indigo-600 whitespace-pre dark:text-indigo-300">
                    ${item.name}
                  </td>
                  <td><p class="text-sm font-bold text-sky-500">${item.rewardPoolAmount} FTM</p></td>
                  <td><p class="text-sm font-bold text-sky-500">${item.rewardPoolAmount} FTM</p></td>
                  <td>
                    <div name="Dialog" class="doc-intro">
                      <ui-button
                        ?disabled="${this.disabled}"
                        @click=${() => {
                          this.currentAlbum = item
                          this.dialog = true
                        }}
                        >VOTE</ui-button
                      >
                      ${when(
                        this.dialog && item.address == this.currentAlbum.address,
                        () =>
                          html`<vote-album-dialog
                            album=${item.address}
                            url=${item.url}
                            votes=${item.votes}
                            @close=${this.close}
                          ></vote-album-dialog>`
                      )}
                    </div>
                  </td>
                </tr> `
            )}
          </table>`
      )}
    </div>`
  }
}
