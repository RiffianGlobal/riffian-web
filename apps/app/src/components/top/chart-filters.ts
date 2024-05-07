import { ThemeElement, customElement, html, state, when } from '@riffian-web/ui/shared/theme-element'

import style from './filters.css?inline'
import { screenStore } from '@lit-web3/base'
import { chartsStore } from '~/store/charts'
import { todayStartUnix, weekStartUnix } from '~/lib/riffutils'

@customElement('chart-filters')
export class ChartFilters extends ThemeElement(style) {

  @state() todayChecked = false

  @state() weekChecked = false

  @state() lessChecked = false

  @state() intervalChecked = false

  @state() greaterChecked = false


  render() {
    return html`
      ${when(
        screenStore.isMobi,
        () => html`
          <div class="flex-col">
            <div class="flex space-x-4 items-start mt-4">
              <span class="mb-2 text-base pb-4 w-20">
                <span>Uploaded</span>
                <br><span>Time</span>
              </span>
              <div class="flex">
                <label class="check-button-mobile mr-4">
                  <input type="checkbox" .checked=${this.todayChecked} id="${fromToday}" @change=${this.handleTimeChange}/>
                  <span class="checkmark-mobile"></span>
                  <span class="text-center">Today</span>
                </label>
                <label class="check-button-mobile">
                  <input type="checkbox" .checked=${this.weekChecked} id="${fromWeek}" @change=${this.handleTimeChange}/>
                  <span class="checkmark-mobile"></span>
                  <span class="text-center">This week</span>
                </label>
              </div>
            </div>
            <div class="flex space-x-4 items-start">
              <span class="mb-2 text-base pb-4 w-20">
                <span>Content</span>
                <br><span>Price</span>
              </span>
                <div class="flex">
                  <label class="check-button-mobile mr-4">
                    <input type="checkbox" .checked=${this.lessChecked} id="${fromLessThan}" @change=${this.handlePriceChange}/>
                    <span class="checkmark-mobile"></span>
                    <span class="text-center">0.1</span>
                  </label>
                  <label class="check-button-mobile mr-4">
                    <input type="checkbox" .checked=${this.intervalChecked} id="${fromInterval}" @change=${this.handlePriceChange}/>
                    <span class="checkmark-mobile"></span>
                    <span class="text-center">0.1 ~ 1</span>
                  </label>
                  <label class="check-button-mobile mr-4">
                    <input type="checkbox" .checked=${this.greaterChecked} id="${fromGreaterThan}" @change=${this.handlePriceChange}/>
                    <span class="checkmark-mobile"></span>
                    <span class="text-center">> 1</span>
                  </label>
                </div>
              </div>
          </div>
        `,
        () => html`
          <div class=" text-white">
            <div class="flex items-start space-x-16">
              <div class="flex flex-col items-start">
                <span class="mb-2 text-base pb-4">Uploaded Time</span>
                <div class="flex">
                  <label class="check-button mr-4">
                    <input type="checkbox" .checked=${this.todayChecked} id="${fromToday}" @change=${this.handleTimeChange}/>
                    <span class="checkmark"></span>
                    <span class="text-center">Today</span>
                  </label>
                  <label class="check-button">
                    <input type="checkbox" .checked=${this.weekChecked} id="${fromWeek}" @change=${this.handleTimeChange}/>
                    <span class="checkmark"></span>
                    <span class="text-center">This week</span>
                  </label>
                </div>
              </div>
              <div class="flex flex-col items-start">
                <span class="mb-2 mr-4 text-base pb-4">Content Price</span>
                <div class="flex">
                  <label class="check-button mr-4">
                    <input type="checkbox" .checked=${this.lessChecked} id="${fromLessThan}" @change=${this.handlePriceChange}/>
                    <span class="checkmark"></span>
                    <span class="text-center">0.1</span>
                  </label>
                  <label class="check-button mr-4">
                    <input type="checkbox" .checked=${this.intervalChecked} id="${fromInterval}" @change=${this.handlePriceChange}/>
                    <span class="checkmark"></span>
                    <span class="text-center">0.1 ~ 1</span>
                  </label>
                  <label class="check-button mr-4">
                    <input type="checkbox" .checked=${this.greaterChecked} id="${fromGreaterThan}" @change=${this.handlePriceChange}/>
                    <span class="checkmark"></span>
                    <span class="text-center">> 1</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        `
      )}
    `
  }

  handlePriceChange(event: any) {
    const id = event.target.id.trim();
    if(id) {
      const value = event.target.checked
      console.log('handlePriceChange id = ', id, ' value = ', value)
      switch (id) {
        case fromLessThan:
          this.lessChecked = value
          if (value) {
            this.intervalChecked = false
            this.greaterChecked = false
          }
          break;
        case fromInterval:
          this.intervalChecked = value
          if (value) {
            this.lessChecked = false
            this.greaterChecked = false
          }
          break;
        case fromGreaterThan:
          this.greaterChecked = value
          if (value) {
            this.lessChecked = false
            this.intervalChecked = false
          }
          break;
        default:
          break;
      }
    
      if (this.lessChecked) {
        chartsStore.filterPriceValue = 'supply_lt: 0'
      } else if (this.intervalChecked) {
        chartsStore.filterPriceValue = 'supply_gte: 0, supply_lte: 9'
      } else if (this.greaterChecked) {
        chartsStore.filterPriceValue = 'supply_gt: 9'
      } else {
        chartsStore.filterPriceValue = '';
      }
    }
  }

  handleTimeChange(event: any) {
    const id = event.target.id.trim();
    if (id) {
      const value = event.target.checked
      console.log('handleTimeChange id = ', id, ' value = ', value)
      switch (id) {
        case fromToday:
          this.todayChecked = value
          if (value) {
            this.weekChecked = false
          }
          break;
        case fromWeek:
          this.weekChecked = value
          if (value) {
            this.todayChecked = false
          }
          break;
        default:
          break;
      }

      if (this.todayChecked) {
        chartsStore.filterTimeValue = 'createdAt_gte:' + todayStartUnix()
      } else if (this.weekChecked) {
        const week = weekStartUnix()
        chartsStore.filterTimeValue = 'createdAt_gte:' + week
      } else {
        chartsStore.filterTimeValue = ''
      }
    }
  }
}

const fromToday = "todayCheckbox"
const fromWeek = "weekCheckbox"
const fromLessThan = "lessThanCheckbox"
const fromInterval = "intervalCheckbox"
const fromGreaterThan = "greaterThanCheckbox"
