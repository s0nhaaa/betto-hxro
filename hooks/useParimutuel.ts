import { create } from 'zustand'

type ParimutuelState = {
  parimutuelPubkey: string
  setParimutuelPubkey: (parimutuelPubkey: string) => void
}

const useParimutuel = create<ParimutuelState>((set) => ({
  parimutuelPubkey: '',
  setParimutuelPubkey: (parimutuelPubkey: string) => set({ parimutuelPubkey }),
}))

export default useParimutuel
