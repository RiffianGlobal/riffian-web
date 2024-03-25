import emitter from '@lit-web3/base/emitter'
import { goto } from '@lit-web3/router'
import { walletStore } from '@riffian-web/ethers/src/wallet'

export const go2Subject = (e: Event, subject: any) => {
  e.preventDefault()
  e.stopPropagation()
  if (!walletStore.account) {
    emitter.emit('connect-wallet')
  } else {
    const tag = e.target?.tagName
    if (tag == 'I') {
      window.open(subject.uri, '_blank')
    } else {
      goto(`/track/${subject.id}`)
    }
  }
}
