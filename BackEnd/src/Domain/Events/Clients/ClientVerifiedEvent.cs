namespace AutoLog.Domain.Events.Clients;

public class ClientVerifiedEvent : BaseEvent
{
    public ClientVerifiedEvent(ApplicationUser user)
    {
        User = user;
    }

    public ApplicationUser User { get; }
}
