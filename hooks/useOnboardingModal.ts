import { create } from 'zustand'

type OnBoadingModalState = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const useOnBoardingModal = create<OnBoadingModalState>((set) => ({
  isOpen: true,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}))

export default useOnBoardingModal
