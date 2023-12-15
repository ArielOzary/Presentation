import { create } from 'zustand'

interface ContactStore {
  isSended: boolean
  setIsSended: (isSended: boolean) => void
}

export const useContactStore = create<ContactStore>(set => ({
  isSended: false,
  setIsSended: (isSended: boolean) => {
    set(() => ({ isSended }))
  },
}))
