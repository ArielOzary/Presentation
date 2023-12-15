import { create } from 'zustand'

interface GeoStore {
  country: string | undefined
  searchPortName: string | undefined
  setCountry: (country: string) => void
  setSearchPortName: (searchPortName: string) => void
}

export const useGeoStore = create<GeoStore>(set => ({
  country: undefined,
  searchPortName: undefined,

  setCountry: (country: string) => {
    set(() => ({ country }))
  },
  setSearchPortName: (searchPortName: string) => {
    set(() => ({ searchPortName }))
  },
}))
