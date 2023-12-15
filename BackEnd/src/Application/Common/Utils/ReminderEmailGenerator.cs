using AutoLog.Application.Common.Dtos.Reminders;
using AutoLog.Domain.Enums;

namespace AutoLog.Application.Common.Utils;

public static class ReminderEmailGenerator
{
    public static ReminderDataDto? GenerateClientDataForEmail(OpenStatusStage openStatus)
    {
        return openStatus switch
        {
            OpenStatusStage.ContactSupplierStatus => new ReminderDataDto
            {
                Subject = "Action Required: Ensure Freight Forwarder Contacts Supplier",
                ForwarderAction = "got in touch with the supplier",
                Reminder = "get in touch with the supplier"
            },
            OpenStatusStage.UploadDocumentsStatus => new ReminderDataDto
            {
                Subject = "Action Required: Ensure Freight Forwarder Uploads the Documents",
                ForwarderAction = "uploaded the documents",
                Reminder = "upload the documents"
            },
            OpenStatusStage.PickupDateStatus => new ReminderDataDto
            {
                Subject = "Action Required: Ensure Freight Forwarder Confirms the pickup date",
                ForwarderAction = "confirmed the pickup date",
                Reminder = "confirm the pickup date"
            },
            OpenStatusStage.FinishedStatus => null,
            _ => throw new NotImplementedException()
        };
    }

    public static ReminderDataDto? GenerateFreightForwarderDataForEmail(OpenStatusStage openStatus)
    {
        return openStatus switch
        {
            OpenStatusStage.ContactSupplierStatus => new ReminderDataDto
            {
                Subject = "Reminder to: Contact Supplier for Shipment Confirmation",
                LatestUpdate = "the contact with the supplier has not yet been confirmed",
            },
            OpenStatusStage.UploadDocumentsStatus => new ReminderDataDto
            {
                Subject = "Reminder to: Upload Required Documents",
                LatestUpdate = "documents have not yet been uploaded",
            },
            OpenStatusStage.PickupDateStatus => new ReminderDataDto
            {
                Subject = "Reminder to: Confirm the Pick Up Date",
                LatestUpdate = "the pick-up date has not yet been confirmed",
            },
            OpenStatusStage.FinishedStatus => null,
            _ => throw new NotImplementedException()
        };
    }
}
