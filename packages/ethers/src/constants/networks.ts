// All Networks
export function chainIdStr(chainId: number | string): string {
  return '0x' + (+chainId).toString(16)
}

const AllNetworks: Networks = {
  '0xd01d': {
    chainId: '0xd01d',
    title: 'DOID',
    name: 'doid',
    native: {
      decimals: 18,
      name: 'DOID',
      symbol: 'DOID'
    },
    provider: 'https://rpc.doid.tech/',
    providerWs: 'wss://rpc.doid.tech/ws',
    scan: 'https://scan.doid.tech',
    icon: '',
    mainnet: true
  },
  '0xdddd': {
    chainId: '0xdddd',
    title: 'DOID Testnet',
    name: 'doid-testnet',
    native: {
      decimals: 18,
      name: 'DOID',
      symbol: 'DOID'
    },
    provider: 'https://rpc.testnet.doid.tech/',
    providerWs: 'wss://rpc.testnet.doid.tech/ws',
    scan: 'https://scan.testnet.doid.tech',
    icon: ''
  }
}

export const SupportNetworkIDs = import.meta.env.MODE === 'production' ? ['0xd01d'] : ['0xd01d', '0xdddd']
export const validChainId = (chainId: ChainId) => SupportNetworkIDs.includes(chainId)

const isProd = import.meta.env.MODE === 'production'
export const mainnetOffline = !!import.meta.env.VITE_DISABLE_MAINNET

export const [mainnetChainId, testnetChainId] = SupportNetworkIDs

const lsKey = 'chainId.def'
const preferredDef = localStorage.getItem(lsKey)
if (preferredDef && !validChainId(preferredDef)) localStorage.removeItem(lsKey)

export const defaultChainId =
  preferredDef ?? (isProd && !mainnetOffline ? mainnetChainId : import.meta.env.VITE_DEF_TESTNET ?? testnetChainId)
export const setDefaultChainId = (chainId: ChainId, reload = false) => {
  if (chainId == defaultChainId || !validChainId(chainId)) return
  localStorage.setItem(lsKey, chainId)
  if (reload) location.reload()
}

export const SupportNetworks = Object.fromEntries(SupportNetworkIDs.map((id) => [id, AllNetworks[id]]))

export const unknownNetwork = {
  title: 'Unsupported Network',
  name: 'unknown',
  chainId: '',
  provider: '',
  scan: '',
  icon: ''
}

export default SupportNetworks
