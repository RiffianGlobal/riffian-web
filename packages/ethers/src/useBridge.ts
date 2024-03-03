import { Networks, mainnetChainId } from './networks'
import Contracts from './constants/contracts'
import { Bridge } from './bridge'
import { walletStore } from './wallet'
import { networkStore } from './networks'
import emitter from '@lit-web3/base/emitter'
import { gasLimit, nowTs } from './utils'
import { normalizeTxErr } from './parseErr'
import { Contract, formatUnits } from 'ethers'
import { State, property } from '@lit-web3/base/state'
export { State, property, StateController } from '@lit-web3/base/state'
export { walletStore }

/** Singleton Data, to keep bridge object and trigger updates as a {@link State} */
class BridgeStore extends State {
  @property({ skipReset: true }) blockNumber!: number
  @property({ skipReset: true }) bridge!: Bridge
  constructor() {
    super()
  }
  get stateTitle(): string {
    return this.bridge.state || ''
  }
  get wallet(): any {
    return walletStore.wallet
  }
  get envKey(): string {
    return `${networkStore.chainId}.${walletStore.account}`
  }
  get noAccount() {
    return (this.wallet?.inited === true || this.bridge.alreadyTried) && !walletStore.account
  }
  get noNetwork() {
    return networkStore.disabled
  }
  get notReady() {
    return this.noAccount || this.noNetwork
  }
  get key() {
    return walletStore.account + networkStore.chainId
  }
}
export const bridgeStore = new BridgeStore()

class BlockPolling {
  public timer: any
  public interval: number
  public blockTs: number
  public blockDebounce: { timer: any; interval: number }
  constructor() {
    this.interval = 15 * 1000
    this.blockTs = 0
    this.blockDebounce = { timer: null, interval: 50 }
    this.getBlockNumber()
    // Events
    emitter.on('tx-success', () => this.broadcast())
    bridgeStore.bridge.subscribe(() => {
      this.reset()
      this.getBlockNumber()
      this.listenProvider()
    }, 'provider')
    this.listenProvider()
    // Polling
    this.polling()
  }
  get block() {
    return bridgeStore.blockNumber
  }
  set block(v: number) {
    bridgeStore.blockNumber = v
  }
  getBlockNumber = async () => {
    const provider = await getBridgeProvider()
    if (provider) this.block = await provider.getBlockNumber()
  }
  polling = () => {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      // Simulate block increment by per 15s
      if (this.blockTs) this.block += Math.floor((nowTs() - this.blockTs) / 15000)
      this.broadcast()
    }, this.interval)
  }
  reset = () => {
    clearTimeout(this.blockDebounce.timer)
    clearTimeout(this.timer)
    this.block = 0
    this.blockTs = 0
    Object.assign(this.blockDebounce, { timer: null, interval: 50 })
  }
  listenProvider = async () => {
    const provider = await getBridgeProvider()
    provider?.on('block', this.onBlock)
  }
  onBlock = (block: number) => {
    if (block <= this.block) return
    const { timer, interval } = this.blockDebounce
    if ((this.blockTs = nowTs()) - this.blockTs < interval) clearTimeout(timer)
    // Ignore first init
    if (this.block) Object.assign(this.blockDebounce, { timer: setTimeout(() => this.broadcast(block), interval) })
    this.block = block
  }
  broadcast = (block = this.block) => {
    emitter.emit('block-polling', block + '')
    this.polling()
  }
}

const initBridge = (options?: useBridgeOptions) => {
  if (!bridgeStore.bridge) {
    bridgeStore.bridge = new Bridge(options)
    new BlockPolling()
  }
  return bridgeStore.bridge
}

const wrapBridge = () => {
  return {
    bridgeStore,
    blockNumber: bridgeStore.blockNumber,
    stateTitle: bridgeStore.stateTitle,
    envKey: bridgeStore.envKey,
    bridge: bridgeStore.bridge
  }
}

export default (options?: useBridgeOptions) => {
  initBridge(options).tryConnect(options)
  return wrapBridge()
}

export const useBridgeAsync = async (options?: useBridgeOptions) => {
  await initBridge(options).tryConnect(options)
  await walletStore.wallet?.ensure()
  return wrapBridge()
}

export const getABI = async (name: string) => (await import(`./abi/${name}.json`)).default
export const getBridge = async () => (await useBridgeAsync()).bridge
export const getBridgeProvider = async () => (await getBridge()).provider
export const getWalletAccount = async () =>
  ((await (await getBridgeProvider()).send('eth_requestAccounts')) ?? [])[0] ?? ''
export const getAccount = async (force = false) => {
  if (force) return await getWalletAccount()
  await getBridge()
  return walletStore.account
}
export const getNetwork = async () => {
  await getBridge()
  return Networks[networkStore.chainId]
}
export const getNetworkSync = () => Networks[networkStore.chainId]
export const getChainId = async () => (await getNetwork()).chainId
export const getEnvKey = async (key = '', withoutAddr = false) =>
  (withoutAddr ? await getChainId() : (await useBridgeAsync()).envKey) + (key ? `.${key}` : '')
export const getSigner = async (account?: string) => (await getBridge()).getSigner(account || (await getAccount()))
export const getBlockNumber = async () => {
  const { blockNumber } = await useBridgeAsync()
  return bridgeStore.blockNumber || blockNumber
}
export const getNonce = async (address?: string) => {
  if (!address) address = await getAccount()
  const provider = await getBridgeProvider()
  return await provider.getTransactionCount(address)
}
export const getGraph = async (path = '') => ((await getNetwork()).graph ?? '') + path

// offest: past seconds, default: 0 (current block)
// blockNumber, default: current block
export const getBlockTimestamp = async ({ offset = 0, blockNumber = 0 } = {}) => {
  if (!blockNumber) blockNumber = await getBlockNumber()
  const { timestamp } = await (await getBridgeProvider()).getBlock(blockNumber - offset / 3)
  return timestamp
}

export const getNativeBalance = async (address: string) =>
  address ? formatUnits(await (await getBridgeProvider()).getBalance(address)) : ''

export const estimateGasLimit = async (
  contract: Contract,
  method: string,
  parameters = <any>[],
  limitPercent?: number
) => {
  let estimatedGas = BigInt(1000000)
  try {
    estimatedGas = BigInt(await contract[method].estimateGas(...parameters))
  } catch (err) {
    throw await normalizeTxErr(err, [method, parameters])
  }
  const limit = gasLimit(estimatedGas)
  return limitPercent ? [limit, gasLimit(estimatedGas, limitPercent)] : limit
}

export const assignOverrides = async (overrides: any, ...args: any[]) => {
  let [contract, method, parameters, { gasLimitPer, nonce } = <any>{}] = args
  const provider = await getBridgeProvider()
  if (!provider) throw new Error('No Provider')
  if (nonce || provider.nonce) overrides.nonce = nonce || provider.nonce
  let gasLimit
  try {
    if (gasLimitPer) {
      gasLimit = (<any[]>await estimateGasLimit(contract, method, parameters, gasLimitPer))[1]
    } else {
      gasLimit = await estimateGasLimit(contract, method, parameters)
    }
  } catch (err) {
    throw await normalizeTxErr(err)
  }
  Object.assign(overrides, { gasLimit })
}

export const getContracts = (name: string, forceMainnet = false): string => {
  const chainId = forceMainnet ? mainnetChainId : networkStore.chainId
  return Contracts[name][chainId]
}

export const getContract = async (
  name: Address,
  { forceMainnet = false, address = getContracts(name, forceMainnet), account = '', requireAccount = false } = <
    getContractOpts
  >{}
) => {
  const abi = await getABI(name)
  if (!abi) throw new Error(`abi not found: ${name}`)
  if (!address && !abi) throw new Error(`Contract ${address} not found`)
  if (!account && requireAccount) account = await getAccount()
  return new Contract(address, abi, await (account ? getSigner(account) : getBridgeProvider()))
}

export const getTokenContract = async (token: Tokenish, options = <getContractOpts>{}) =>
  await getContract(token.address || token.contract || token, { abiName: 'Erc721', ...options })
