import { ThemeElement, customElement, html, property, state, when } from '@riffian-web/ui/shared/theme-element'

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
                <button id="${fromToday}" class="checkbox-mobile mr-4 ${this.todayChecked ? 'checked' : ''}" @click=${this.handleTimeChange}>Today</button>
                <button id="${fromWeek}" class="checkbox-mobile ${this.weekChecked ? 'checked' : ''}" @click=${this.handleTimeChange}>This week</button>
              </div>
            </div>
            <div class="flex space-x-4 items-start">
              <span class="mb-2 text-base pb-4 w-20">
                <span>Content</span>
                <br><span>Price</span>
              </span>
                <button id="${fromLessThan}" class="checkbox-mobile mr-4 ${this.lessChecked ? 'checked' : ''}" @click=${this.handlePriceChange}>0.1</button>
                <button id="${fromInterval}" class="checkbox-mobile mr-4 ${this.intervalChecked ? 'checked' : ''}" @click=${this.handlePriceChange}>0.1 ~ 1</button>
                <button id="${fromGreaterThan}" class="checkbox-mobile mr-4 ${this.greaterChecked ? 'checked' : ''}" @click=${this.handlePriceChange}>> 1</button>
              </div>
          </div>
        `,
        () => html`
          <div class=" text-white">
            <div class="flex items-start space-x-16">
              <div class="flex flex-col items-start">
                <span class="mb-2 text-base pb-4">Uploaded Time</span>
                <div class="flex">
                  <button id="${fromToday}" class="checkbox mr-4 ${this.todayChecked ? 'checked' : ''}" @click=${this.handleTimeChange}>Today</button>
                  <button id="${fromWeek}" class="checkbox ${this.weekChecked ? 'checked' : ''}" @click=${this.handleTimeChange}>This week</button>
                </div>
              </div>
              <div class="flex flex-col items-start">
                <span class="mb-2 mr-4 text-base pb-4">Content Price</span>
                <div class="flex">
                  <button id="${fromLessThan}" class="checkbox mr-4 ${this.lessChecked ? 'checked' : ''}" @click=${this.handlePriceChange}>0.1</button>
                  <button id="${fromInterval}" class="checkbox mr-4 ${this.intervalChecked ? 'checked' : ''}" @click=${this.handlePriceChange}>0.1 ~ 1</button>
                  <button id="${fromGreaterThan}" class="checkbox mr-4 ${this.greaterChecked ? 'checked' : ''}" @click=${this.handlePriceChange}>> 1</button>
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
      switch (id) {
        case fromLessThan:
          this.lessChecked = !this.lessChecked
          if (this.lessChecked) {
            this.intervalChecked = false
            this.greaterChecked = false
          }
          break;
        case fromInterval:
          this.intervalChecked = !this.intervalChecked
          if (this.intervalChecked) {
            this.lessChecked = false
            this.greaterChecked = false
          }
          break;
        case fromGreaterThan:
          this.greaterChecked = !this.greaterChecked
          if (this.greaterChecked) {
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
      switch (id) {
        case fromToday:
          this.todayChecked = !this.todayChecked
          if (this.todayChecked) {
            this.weekChecked = false
          }
          break;
        case fromWeek:
          this.weekChecked = !this.weekChecked
          if (this.weekChecked) {
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
