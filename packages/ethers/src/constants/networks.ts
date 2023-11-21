// All Networks
const apiKeyInfura = import.meta.env.VITE_KEY_INFURA
export const AllNetworks = {
  '0x1': {
    chainId: '0x1',
    title: 'Mainnet',
    name: 'mainnet',
    // provider: 'https://rpc.ankr.com/eth',
    // providerWs: 'wss://rpc.ankr.com/ws'
    provider: `https://mainnet.infura.io/v3/${apiKeyInfura}`,
    providerWs: `wss://mainnet.infura.io/ws/v3/${apiKeyInfura}`,
    scan: 'https://etherscan.io',
    icon: ''
  },
  '0xfa2': {
    chainId: '0xfa2',
    title: 'Fantom Testnet',
    name: 'FantomTestnet',
    symbol: 'FTM',
    native: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    provider: 'https://rpc.testnet.fantom.network',
    providerWs: 'wss://rpc.testnet.fantom.network/ws',
    scan: 'https://testnet.ftmscan.com',
    icon: ''
  },
  '0xaa36a7': {
    chainId: '0xaa36a7',
    title: 'Fantom testnet',
    name: 'SepoliaTestnet',
    // provider: 'https://rpc.sepolia.dev',
    // providerWs: 'wss://rpc.sepolia.dev/ws',
    provider: `https://sepolia.infura.io/v3/${apiKeyInfura}`,
    providerWs: `wss://sepolia.infura.io/ws/v3/${apiKeyInfura}`,
    scan: 'https://sepolia.etherscan.io',
    icon: ''
  },
  '0x5': {
    chainId: '0x5',
    title: 'Görli Testnet',
    name: 'GoerliTestnet',
    // provider: 'https://rpc.goerli.dev',
    // providerWs: 'wss://rpc.goerli.dev/ws',
    provider: `https://goerli.infura.io/v3/${apiKeyInfura}`,
    providerWs: `wss://goerli.infura.io/ws/v3/${apiKeyInfura}`,
    scan: 'https://goerli.etherscan.io',
    icon: ''
  }
}
export const EtherNetworks = ['0x1', '0xaa36a7', '0x5']

export const unknownNetwork = {
  title: 'Unsupported Network',
  name: 'unknown',
  chainId: '',
  provider: '',
  scan: '',
  icon: ''
}

export default AllNetworks
