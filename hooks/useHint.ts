import { create } from 'zustand'

type HintState = {
  content: string
  showHint: boolean
  setShowHint: (showHint: boolean) => void
}

const useHint = create<HintState>((set) => ({
  content: '',
  showHint: false,
  setShowHint: (showHint: boolean) => set({ showHint }),
}))

export default useHint
