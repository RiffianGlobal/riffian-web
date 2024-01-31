// All Networks
export function chainIdStr(chainId: number): string {
  return '0x' + chainId.toString(16)
}
// @todo seems native is unused
// export const native = { name: 'Ethereum', symbol: 'ETH', decimals: 18 }

export const AllNetworks = {
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

export const SupportNetworks = import.meta.env.MODE === 'production' ? ['0xd01d'] : ['0xd01d', '0xdddd']

export const unknownNetwork = {
  title: 'Unsupported Network',
  name: 'unknown',
  chainId: '',
  provider: '',
  scan: '',
  icon: ''
}

export default AllNetworks
