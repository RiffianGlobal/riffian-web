// import { CrosshairMode } from 'lightweight-charts'
export const [colorUp, colorDown] = ['#089981', '#F23645']
export const tvConf = {
  height: 240,
  layout: {
    background: {
      color: 'transparent'
    },
    textColor: 'rgba(255, 255, 255, 0.8)'
  },
  grid: {
    vertLines: {
      color: '#292641'
    },
    horzLines: {
      color: '#292641'
    }
  },
  // crosshair: {
  //   mode: CrosshairMode.Normal
  // },
  rightPriceScale: {
    borderColor: '#262941'
  },
  timeScale: {
    borderColor: '#262941'
  }
}

export const candleConf = {
  upColor: colorUp,
  wickUpColor: colorUp,
  borderUpColor: colorUp,
  downColor: colorDown,
  wickDownColor: colorDown,
  borderDownColor: colorDown
}

export const volumeConf = {
  upColor: 'rgba(8, 153, 129, 0.6)',
  downColor: 'rgba(242, 54, 69, 0.6)',
  priceFormat: { type: 'volume' },
  priceScaleId: '',
  scaleMargins: { top: 0.9, bottom: 0 }
}

export const areaConf = {
  topColor: 'rgba(2, 240, 117, 0.1)',
  bottomColor: 'rgba(22, 20, 48, 0.1)',
  lineColor: 'rgba(22, 228, 125, 0.1)',
  lineWidth: 1
}
