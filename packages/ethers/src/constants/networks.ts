// All Networks
const apiKeyInfura = import.meta.env.VITE_KEY_INFURA
export function chainIdStr(chainId: number): string {
  return '0x' + chainId.toString(16)
}
// @todo seems native is unused
// export const native = { name: 'Ethereum', symbol: 'ETH', decimals: 18 }

export const AllNetworks = {
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

export const EtherNetworks = ['0xfa2']

export const unknownNetwork = {
  title: 'Unsupported Network',
  name: 'unknown',
  chainId: '',
  provider: '',
  scan: '',
  icon: ''
}

export default AllNetworks
