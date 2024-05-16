import { screenStore } from '@lit-web3/base'
import { customElement, ThemeElement, html, when, state, property } from '../shared/theme-element'

import style from './rookie.css?inline'


@customElement('ui-tip-rookie')
export class UITipRookie extends ThemeElement(style) {

  @property({type: Boolean})
  show = false;

  close = async (opts?: any) => {
    this.emit('close', opts)
  }

  render() {
    return html `
      ${when(
        screenStore.isMobi,
        () => html`
          <div class="backdrop">
            <div class="rookie-bg-mobile">
              <div class="modal-mobile">
                <button class="close mr-4" @click="${this.close}">
                  <svg xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-6 h-6">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
                <p class="font-medium text-sm mt-8 mb-4 text-center">Come to RIFFIAN and earn $DOID!</p>
                <p class="content-text-mobile">You can claim rewards and get $DOID; </p>
                <p class="content-text-mobile">can vote for the content you like, and as long as it enters the weekly list, you can also get a share of the prize pool rewards; </p>
                <p class="content-text-mobile">You can vote for the content you like at a low price, then wait for others to vote and then sell it to get the price difference.</p>
                <p class="font-bold text-xs mt-4 ml-6 mr-4 text-left  ">Come and play together!</p>
                <button class="play-button-mobile" @click="${this.close}">Let's Play</button>
                <div class="top-left-mobile-logo"></div>
                <div class="left-center-mobile-logo"></div>
                <div class="left-bottom-mobile-logo"></div>
                <div class="right-bottom-mobile-logo"></div>
                <div class="right-bottom-free-mobile-logo"></div>
              </div>
            </div>
          </div>
        `,
        () => html`
          <div class="backdrop">
            <div class="modal">
              <button class="close mr-8" @click="${this.close}">
                <svg xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="w-6 h-6">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <p class="font-semibold text-xl mb-4 text-center">Come to RIFFIAN and earn $DOID!</p>
              <p class="content-text">You can claim rewards and get $DOID; </p>
              <p class="content-text">can vote for the content you like, and as long as it enters the weekly list, you can also get a share of the prize pool rewards; </p>
              <p class="content-text">You can vote for the content you like at a low price, then wait for others to vote and then sell it to get the price difference.</p>
              <p class="content-text font-light">Come and play together!</p>
              <button class="play-button" @click="${this.close}">Let's Play</button>
              <div class="top-left-logo"></div>
              <div class="left-top-logo"></div>
              <div class="left-bottom-logo"></div>
              <div class="right-bottom-logo"></div>
              <div class="right-bottom-free-logo"></div>
            </div>
          </div>
        `
      )}
    `
  }
}
