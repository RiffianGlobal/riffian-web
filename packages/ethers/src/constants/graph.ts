// SubGraph API
import Network from '../networks'
import http, { Jsonish } from '@riffian-web/core/src/http'

export const SubGraph: ChainConf = {
  main: {
    '0x1': 'https://api.studio.thegraph.com/query/',
    '0xaa36a7': 'https://api.studio.thegraph.com/query/',
    '0x5': 'https://api.studio.thegraph.com/query/'
  }
}

export const getGraphUri = (name: string) => SubGraph[name][Network.chainId]

export const graphQuery = async (name = 'main', query: string, variables?: {}, operationName?: string) =>
  http.post(getGraphUri(name), { query, variables, operationName })

export const genWhere = (params: Jsonish = {}): string => {
  let conditions: string[] = []
  for (let k in params) {
    let v = params[k]
    if (v) conditions.push(`${k}:"${v}"`)
  }
  return conditions.join(' ')
}

export const genPaging = (paging?: Pagination) => {
  if (!paging) return ''
  const { page, pageSize } = paging
  const str: string[] = []
  if (pageSize) {
    str.push(`first:${pageSize}`)
    if (page && page > 1) str.push(`skip:${+pageSize * (+page - 1)}`)
  }
  return str.join(' ')
}

export default SubGraph
