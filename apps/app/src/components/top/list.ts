import { TailwindElement, customElement, html, repeat, state, when } from '@riffian-web/ui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@riffian-web/ethers/src/useBridge'
import '~/components/top/dialog'
import { albumList } from './action'
import '@riffian-web/ui/src/loading/icon'
import '@riffian-web/ui/src/loading/skeleton'

@customElement('top-album')
export class NewAlbum extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() albumList:any = []
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
      'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/You_Are_Not_Alone.jpg/220px-You_Are_Not_Alone.jpg'
    ]
    console.log(JSON.stringify(this.albumList))
    for (var i = 0; i < this.albumList.length; i++) {
      this.albumList[i].url = urls[this.getRandomInt(2)]
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
          html` <ul class="connect-wallet-list">
            ${repeat(
              this.albumList,
              (item: any, i) =>
                html`<li>
                  <table>
                    <tr>
                      <p class="my-2 font-bold text-lg">${i + 1}.${item.name}</p>
                    </tr>
                    <tr>
                      <td colspan="2"><img class="w-36 h-36" src=${item.url} /></td>
                      <td>${item.desc}</td>
                    </tr>
                    <tr>
                      <td>
                        <span>
                          <p class="text-sm text-gray-500">Reward Pool Amount</p>
                          <p class="text-sm font-bold text-sky-500">${item.rewardPoolAmount} FTM</p>
                        </span>
                      </td>
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
                      <td></td>
                    </tr>
                  </table>
                </li>`
            )}
          </ul>`
      )}
    </div>`
  }
}
