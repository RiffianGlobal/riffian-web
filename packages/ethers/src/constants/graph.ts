// SubGraph API
import Network from '../networks'
import { defaultChainId } from '../constants/networks'
import http, { Jsonish } from '@lit-web3/base/http'

export const SubGraph: ChainConf = {
  MediaBoard: {
    '0xd01d': 'https://gql.riffian.global/subgraphs/name/riffian/board',
    '0xdddd': 'https://gql-test.riffian.global/subgraphs/name/riffian/board'
  }
}

export const getGraphUri = async (name: string) => {
  await new Promise<void>((resolve) => setTimeout(resolve))
  return SubGraph[name][Network.chainId] ?? SubGraph[name][defaultChainId]
}

export const graphQuery = async (name = 'MediaBoard', query: string, variables?: {}, operationName?: string) =>
  http.post(await getGraphUri(name), { query, variables, operationName })

export const graphSubscribe = async (
  name = 'MediaBoard',
  subscription: string,
  variables?: {},
  operationName?: string
) => {
  // event-stream
  http.post(await getGraphUri(name), { subscription, variables, operationName })
}

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
