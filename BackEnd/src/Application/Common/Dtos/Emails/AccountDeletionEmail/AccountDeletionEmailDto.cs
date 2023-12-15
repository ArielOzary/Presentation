namespace AutoLog.Application.Common.Dtos.Emails.AccountDeletionEmail;

public class AccountDeletionEmailDto : BaseEmailDto
{
    public string CompanyContactName { get; set; } = string.Empty;
}
