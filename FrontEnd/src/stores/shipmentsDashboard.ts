import { create } from 'zustand'

import { GetShipmentsForMapQuery, ShipmentDetailDto } from 'models'

interface ShipmentsDashboardStore {
  shipment: ShipmentDetailDto
  shipmentId: string
  openChat: boolean
  currency: string
  searchByNumber: string
  searchByKeyWords: string | undefined
  filtersData: GetShipmentsForMapQuery
  setShipmentItem: (shipment: ShipmentDetailDto) => void
  setShipmentId: (shipmentId: string) => void
  setOpenChat: (openChat: boolean) => void
  setCurrency: (currency: string) => void
  setSearchByNumber: (searchByNumber: string) => void
  setSearchByKeyWords: (searchByKeyWords: string | undefined) => void
  setFiltersData: (filtersData: GetShipmentsForMapQuery) => void
}

export const useShipmentsDashboardStore = create<ShipmentsDashboardStore>(
  set => ({
    shipment: {},
    shipmentId: '',
    openChat: false,
    currency: 'usd',
    searchByNumber: '',
    searchByKeyWords: undefined,
    filtersData: {},
    setShipmentItem: (shipment: ShipmentDetailDto) => {
      set(() => ({ shipment }))
    },
    setShipmentId: (shipmentId: string) => {
      set(() => ({ shipmentId }))
    },
    setOpenChat: (openChat: boolean) => {
      set(() => ({ openChat }))
    },
    setCurrency: (currency: string) => {
      set(() => ({ currency }))
    },
    setSearchByNumber: (searchByNumber: string) => {
      set(() => ({ searchByNumber }))
    },
    setSearchByKeyWords: (searchByKeyWords: string | undefined) => {
      set(() => ({ searchByKeyWords }))
    },
    setFiltersData: (filtersData: GetShipmentsForMapQuery) => {
      set(() => ({ filtersData }))
    },
  })
)
