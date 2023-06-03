import { create } from 'zustand'

type PlayerWalletState = {
  wallet: string
  setWallet: (wallet: string) => void
}

const usePlayerWallet = create<PlayerWalletState>((set) => ({
  wallet: '',
  setWallet: (wallet: string) => set({ wallet }),
}))

export default usePlayerWallet
