// All Networks
const apiKeyInfura = import.meta.env.VITE_KEY_INFURA
export function chainIdStr(chainId: number): string {
  return '0x' + chainId.toString(16)
}
// @todo seems native is unused
// export const native = { name: 'Ethereum', symbol: 'ETH', decimals: 18 }

export const AllNetworks = {
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
    providerWs: 'ws://rpc.testnet.doid.tech/ws',
    scan: 'https://scan.testnet.doid.tech',
    icon: ''
  },
  '0xfa2': {
    chainId: '0xfa2',
    title: 'Fantom Testnet',
    name: 'FantomTestnet',
    native: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    provider: 'https://rpc.testnet.fantom.network',
    providerWs: '',
    scan: 'https://testnet.ftmscan.com',
    ens: { address: '', network: 4002 },
    icon: ''
  }
}

export const SupportNetworks = ['0xdddd', '0xfa2']

export const unknownNetwork = {
  title: 'Unsupported Network',
  name: 'unknown',
  chainId: '',
  provider: '',
  scan: '',
  icon: ''
}

export default AllNetworks
