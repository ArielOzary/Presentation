import { create } from 'zustand'

interface AdminClientsStore {
  companyName: string
  setCompanyName: (companyName: string) => void
}

export const useAdminClientsStore = create<AdminClientsStore>(set => ({
  companyName: '',
  setCompanyName: (companyName: string) => set(() => ({ companyName })),
}))
