import { Players } from '@/types/player'
import { create } from 'zustand'

type PlayerState = {
  players: Players | undefined
  setPlayers: (players: Players) => void
}

const usePlayerStore = create<PlayerState>((set) => ({
  players: undefined,
  setPlayers: (players: Players) => set({ players }),
}))

export default usePlayerStore
