using AutoLog.Application.Common.Dtos.Company.CompanyContact;
using AutoLog.Domain.Entities;

namespace AutoLog.Application.Common.Utils;

public static class ContactListValidator
{
    public static void ValidateContactList(ProviderInfo providerInfo, List<CompanyContactProfileDto> list)
    {
        if (!providerInfo.Ocean)
        {
            list.RemoveAll(x => x.ContactType == Domain.Enums.CompanyContactType.Ocean);
        }
        if (!providerInfo.Air)
        {
            list.RemoveAll(x => x.ContactType == Domain.Enums.CompanyContactType.Air);
        }
        if (!providerInfo.Customs)
        {
            list.RemoveAll(x => x.ContactType == Domain.Enums.CompanyContactType.Customs);
        }
    }
}
