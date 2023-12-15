import { ShipmentStatusStage } from 'models'

export const getShipmentProgress = (status?: ShipmentStatusStage) => {
  switch (status) {
    case ShipmentStatusStage.Open:
      return 12.5
    case ShipmentStatusStage.Booking:
      return 25
    case ShipmentStatusStage.EstimatedTimeOfDeparture:
      return 37.5
    case ShipmentStatusStage.GoodsAreOnBoardOrActualDeparture:
      return 50
    case ShipmentStatusStage.EstimatedTimeOfArrival:
      return 62.5
    case ShipmentStatusStage.NoticeOfArrival:
      return 75
    case ShipmentStatusStage.Clearance:
      return 87.5
    case ShipmentStatusStage.Delivered:
      return 100
    default:
      return 0
  }
}
