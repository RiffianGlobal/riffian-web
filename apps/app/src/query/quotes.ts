import { graphQuery } from '@riffian-web/ethers/src/constants/graph'
import { formatUnits, parseUnits } from 'ethers'

export const quotesFrag = ({ id: pair } = <graphParams>{}) => `
  quotes: voteHourDatas ( where: { subject: "${pair}" } orderBy: date ) { date high close low open volume }
`

export const quotesReq = async (req: graphParams) => {
  const { quotes } = await graphQuery('MediaBoard', `{ ${quotesFrag(req)} }`)
  return { quotes: cookQuote(quotes) }
}

const toNumber = (str: string) => +formatUnits(str)
export type Quote = {
  time: number
  open: number
  high: number
  low: number
  close: number
  value: number
  customValues: {
    chg: number
  }
}
export const cookQuote = (quotes = []): Quote[] => {
  return [quotes].flat().map((quote: any) => {
    let { date, high, low, open, close, volume } = quote
    open = toNumber(open)
    close = toNumber(close)
    const chg = +(close - open).toFixed(2)
    const res = {
      time: date * 3600,
      open,
      high: toNumber(high),
      low: toNumber(low),
      close,
      value: +volume,
      customValues: { chg }
    }
    return res
  })
}
