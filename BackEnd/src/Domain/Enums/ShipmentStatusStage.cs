namespace AutoLog.Domain.Enums;

public enum ShipmentStatusStage
{
    Open = 0,
    Booking = 1,
    EstimatedTimeOfDeparture = 2,
    GoodsAreOnBoardOrActualDeparture = 3,
    EstimatedTimeOfArrival = 4,
    NoticeOfArrival = 5,
    Clearance = 6,
    Delivered = 7,
    Delayed = 8,
}
