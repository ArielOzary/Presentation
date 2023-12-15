import { create } from 'zustand'

import { ClientCustomQuoteDto, ClientDto } from 'models'

interface FreightForwarderClientsStore {
  client: ClientDto | undefined
  customQuote: ClientCustomQuoteDto | undefined
  setClient: (client: ClientDto) => void
  setCustomQuote: (customQuote: ClientCustomQuoteDto) => void
}

export const useFreightForwarderClientsStore =
  create<FreightForwarderClientsStore>(set => ({
    client: undefined,
    customQuote: undefined,
    setClient: (client: ClientDto) => set(() => ({ client })),
    setCustomQuote: (customQuote: ClientCustomQuoteDto) =>
      set(() => ({ customQuote })),
  }))
