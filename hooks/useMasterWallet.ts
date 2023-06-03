import { Keypair, PublicKey } from '@solana/web3.js'
import { create } from 'zustand'

type MasterWalletState = {
  keypair: Keypair | undefined
  setKeyair: (keypair: Keypair) => void
}

const useMasterWallet = create<MasterWalletState>((set) => ({
  keypair: undefined,
  setKeyair: (keypair: Keypair) => set({ keypair }),
}))

export default useMasterWallet
