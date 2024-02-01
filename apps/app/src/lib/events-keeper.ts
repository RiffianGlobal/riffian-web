import { emitter } from '@lit-web3/base/emitter'
import { getAlbumContract } from './riffutils'

export const [worldEvent] = ['block-world']

// World Events
export const worldEvents = ['EventVote', 'EventBind', 'EventClaimReward']
const emitWorldEvents = (...args: any) => emitter.emit(worldEvent, args)

const subscribeWorld = async (): Promise<() => void> => {
  const [contract] = await Promise.all([getAlbumContract(true)])
  worldEvents.forEach((name) => contract.on(name, emitWorldEvents))
  return () => worldEvents.forEach((name) => contract.off(name, emitWorldEvents))
}

// Tranaction with self
const subscribeSelf = async (): Promise<() => void> => {
  return () => {}
}

// Initialize
let inited = false
export const init = async () => {
  if (inited) return
  inited = true
  let unsubscribeWorld = await subscribeWorld()
  emitter.on('wallet-changed', async (e: CustomEvent) => {
    const { chainChanged } = e.detail
    if (chainChanged) {
      unsubscribeWorld()
      unsubscribeWorld = await subscribeWorld()
    }
  })
}
