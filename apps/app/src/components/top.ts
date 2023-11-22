import {
  TailwindElement,
  customElement,
  html,
  repeat,
  property,
  state,
  when,
  queryAll
} from '@riffian-web/ui/src/shared/TailwindElement'
import { getContract } from '@riffian-web/ethers/src/useBridge'
import { parseRevertReason } from '@riffian-web/ethers/src/parseErr'

@customElement('top-album')
export class NewAlbum extends TailwindElement('') {
  @property({ type: Array }) albumList = []
  @property({ type: String }) err = ''
  @property({ type: String }) result = ''
  @property({ type: Boolean }) dialog = false
  @property({ type: Boolean }) voting = false
  @property({ type: JSON }) currentAlbum = { address: '', votes: 0, url: '' }
  @property({ type: Number }) votePrice = 0
  init = () => {
    var list: any = []
    list.push({
      address: '0xD9bDD17b3a77a24A8d40934e537a4B1e0f9235A8',
      url: 'https://i1.sndcdn.com/artworks-000329038545-d554xk-t500x500.jpg',
      price: 0.1,
      votes: 'loading...',
      desc: '"Beat It" is a song by American singer Michael Jackson from his sixth studio album, Thriller (1982)',
      name: 'Beat it'
    })
    list.push({
      address: '0x17C4f43e5A65d4bfE3f54E6FBd19aA2fAA7686Be',
      url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/You_Are_Not_Alone.jpg/220px-You_Are_Not_Alone.jpg',
      price: 0.2,
      votes: 'loading...',
      desc: '"You Are Not Alone" is a pop and R&B ballad about love and isolation',
      name: 'You Are Not Alone'
    })
    this.albumList = list
  }

  getVotePrice = async () => {
    console.log('get vote price.')
    try {
      // const overrides = {} as any
      const contract = await getContract('MediaBoard', { abiName: 'MediaBoard' })
      console.log(contract)
      const albumData = await contract.albumToData(this.currentAlbum.address)
      const votes = albumData[1]
      this.currentAlbum.votes = Number(votes)
      console.log('get vote price: ' + (Number(votes) + 1))
      this.votePrice = await contract.currentVotePrice(this.currentAlbum.address, Number(votes) + 1)
      console.log('get vote price: ' + this.votePrice)
    } catch (e) {
      this.err = await parseRevertReason(e)
    }
  }

  vote = async () => {
    this.voting = true
    try {
      // const overrides = {} as any
      const contract = await getContract('MediaBoard', { abiName: 'MediaBoard' })
      console.log(contract)
      const txn = await contract.vote(this.currentAlbum.address)
      console.log(txn)
      await txn.wait()
      this.result = 'Vote success, please visit scan for details. txn hash: ' + txn.hash
    } catch (e) {
      this.err = await parseRevertReason(e)
    }
  }

  render() {
    this.init()
    console.log(this.albumList)
    return html` <div class="grid place-items-center b-1 border m-4 p-4 rounded-md">
      <ul class="connect-wallet-list">
        ${repeat(
          this.albumList,
          (item, i) =>
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
                      <p class="text-sm text-gray-500">price</p>
                      <p class="text-sm font-bold text-sky-500">${item.price} FTM</p>
                    </span>
                  </td>
                  <td>
                    <div name="Dialog" class="doc-intro">
                      <ui-button
                        @click=${() => {
                          this.dialog = true
                          this.currentAlbum = item
                          this.getVotePrice()
                        }}
                        >VOTE</ui-button
                      >
                      ${when(
                        this.dialog,
                        () =>
                          html`<ui-dialog
                            @close=${() => {
                              this.dialog = false
                              this.votePrice = 0
                              this.voting = false
                              this.err = ''
                              this.result = ''
                              this.currentAlbum = { address: '', votes: 0, url: '' }
                            }}
                          >
                            <p class="my-2 font-bold">VOTE Album</p>
                            <div class="grid place-items-center b-1 border m-4 p-4 rounded-md">
                              <img class="w-36 h-36" src=${this.currentAlbum.url} />

                              ${when(
                                !this.votePrice,
                                () =>
                                  html`<i class="text-5xl mdi mdi-loading"></i>
                                    <p>Loading vote price...</p>`
                              )}${when(
                                this.votePrice && !this.voting,
                                () => html`
                                  <p>Estimated cost</p>
                                  <p class="text-5xl text-sky-500">
                                    ${Number(this.votePrice) / 1000000000000000000} FTM
                                  </p>
                                  <p>Current Votes:${this.currentAlbum.votes}</p>
                                  <ui-button class="m-1" @click=${this.vote}> VOTE THIS! </ui-button>
                                `
                              )}${when(
                                this.voting && !(this.err || this.result),
                                () =>
                                  html`<i class="text-5xl mdi mdi-loading"></i>
                                    <p>Waiting for vote result...</p>`
                              )}
                              ${when(
                                this.err || this.result,
                                () =>
                                  html` <p class="text-lg text-red-400">${this.err}</p>
                                    <p class="text-lg text-blue-300">${this.result}</p>`
                              )}
                            </div>
                          </ui-dialog>`
                      )}
                    </div>
                  </td>
                  <td></td>
                </tr>
              </table>
              <!-- <i class="mdi mdi-arrow-right"></i> -->
            </li>`
        )}
      </ul>
    </div>`
  }
}
