export enum WalletState {
  DISCONNECTED = 'Disconnected',
  CONNECTED = 'Connected',
  CONNECTING = 'Connecting...',
  NOT_INSTALLED = 'Not Installed',
  INSTALLED = 'Installed',
  INSTALLING = 'Installing...',
  WAITING = 'Waiting...'
}

export const signInKey = 'wallet.signIn'
