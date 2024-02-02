import {
  ThemeElement,
  html,
  customElement,
  property,
  state,
  Ref,
  ref,
  createRef
} from '@riffian-web/ui/shared/theme-element'
import { bridgeStore } from '@riffian-web/ethers/src/useBridge'
import { StateController, rewardStore } from '~/store/reward'
import { createChart } from 'lightweight-charts'
import { tvConf, candleConf, volumeConf, areaConf } from './tv-conf'
import { quotesReq } from '~/query/quotes'
import { emitter } from '@lit-web3/base/emitter'
// Components
import '@riffian-web/ui/loading/icon'

import style from './tv.css?inline'

@customElement('chart-tv-lite')
export class ChartTvLite extends ThemeElement(style) {
  el$: Ref<HTMLElement> = createRef()

  bindBridge: any = new StateController(this, bridgeStore)
  bindStore: any = new StateController(this, rewardStore)

  @property() pair!: string

  @state() chart: any = null
  @state() candleSeries: any = null
  @state() volumeSeries: any = null
  @state() areaSeries: any = null
  @state() pending = true
  @state() inited = false
  @state() quotes: any[] = []
  @state() curBar: any = null

  get loading() {
    return !this.inited && this.pending
  }
  get bar() {
    return this.curBar ?? this.getLastBar()
  }
  get ticker() {
    if (!this.bar) return ''
    const { chg } = this.bar.customValues
    const stat = `ticker-${chg >= 0 ? 'up' : 'down'}`
    return html`O <span class=${stat}>${this.toFixed(this.bar.open)}</span> H
      <span class=${stat}>${this.toFixed(this.bar.high)}</span> L
      <span class=${stat}>${this.toFixed(this.bar.low)}</span> C
      <span class=${stat}>${this.toFixed(this.bar.close)}</span>
      <span class=${stat}>${chg <= 0 ? chg || '' : `+${chg}`}</span>`
  }

  toFixed = (s: number) => {
    return +s.toFixed(2)
  }

  fetch = async () => {
    this.pending = true
    try {
      const { quotes } = await quotesReq({ id: this.pair })
      this.quotes = quotes
    } catch {}
    this.pending = false
    this.inited = true
  }
  updateChart = async () => {
    // init data
    await this.fetch()
    this.areaSeries.setData(this.quotes)
    this.volumeSeries.setData(this.quotes)
    this.volumeSeries.priceScale().applyOptions(volumeConf)
    this.candleSeries.setData(this.quotes)
    // this.chart.timeScale().fitContent()
  }

  init = async () => {
    // Creat chart
    this.chart ??= createChart(this.el$.value!, tvConf)
    this.areaSeries ??= this.chart.addAreaSeries(areaConf)
    this.volumeSeries ??= this.chart.addHistogramSeries(volumeConf)
    this.candleSeries ??= this.chart.addCandlestickSeries(candleConf)
    this.chart.subscribeCrosshairMove(this.onMove)
    await this.updateChart()
    this.onMove()
  }

  getLastBar = () => this.candleSeries?.dataByIndex(this.candleSeries.dataByIndex(Infinity, -1))
  onMove = (p?: any) => {
    const validCrosshairPoint = !(p === undefined || p.time === undefined || p.point.x < 0 || p.point.y < 0)
    this.curBar = validCrosshairPoint ? p.seriesData.get(this.candleSeries) : null
  }

  firstUpdated() {
    this.init()
  }

  listener = async () => {
    // TODO: use quotesSubscribe by EventStream
    await this.updateChart()
  }
  connectedCallback() {
    super.connectedCallback()
    emitter.on('block-world', this.listener)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.on('block-world', this.listener)
  }

  render() {
    return html`
      <div class="chart-container" ${ref(this.el$)}></div>
      <div class="z-10 text-xs left-4 top-4 absolute pointer-events-none">${this.ticker}</div>
    `
  }
}
