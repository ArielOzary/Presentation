import { create } from 'zustand'

import { ShipmentSortOption } from 'models'

interface SortShipmentsStore {
  sortBy: ShipmentSortOption
  setSortBy: (sortBy: ShipmentSortOption) => void
}

export const useSortShipmentsStore = create<SortShipmentsStore>(set => ({
  sortBy: ShipmentSortOption.LastAdded,
  setSortBy: (sortBy: ShipmentSortOption) => {
    set(() => ({ sortBy }))
  },
}))
