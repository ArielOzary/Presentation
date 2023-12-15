import { create } from 'zustand'

interface ChatStore {
  isUnread: boolean
  setIsUnread: (isUnread: boolean) => void
}

export const useChatStore = create<ChatStore>(set => ({
  isUnread: true,
  setIsUnread: (isUnread: boolean) => set(() => ({ isUnread })),
}))
