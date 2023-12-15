import { useMemo } from 'react'

import { ShipmentStatusStage } from 'models'

export const useTagColor = (item?: ShipmentStatusStage) => {
  const tagColor = useMemo((): string => {
    switch (item) {
      case ShipmentStatusStage.Booking:
        return 'processing'
      case ShipmentStatusStage.Delayed:
        return 'error'
      case ShipmentStatusStage.Clearance:
        return 'warning'
      case ShipmentStatusStage.Delivered:
        return 'success'
      default:
        return 'purple'
    }
  }, [item])

  return { tagColor }
}
