import { useContactInfoForm } from 'containers/Public/ClientSignUp/ContactInfo/hooks/contactInfoForm'

import {
  CompanyContactProfileDto,
  CompanyContactType,
  FreightForwarderBasicInfoDto,
  FreightForwarderContactsDto,
} from 'models'

export const useContactsInfoForm = () => {
  const oceanForm = useContactInfoForm()
  const airForm = useContactInfoForm()
  const customsForm = useContactInfoForm()
  const paymentForm = useContactInfoForm()

  const init = (data: FreightForwarderContactsDto) => {
    if (data) {
      const { companyContacts = [] } = data

      const oceanContact = companyContacts.find(
        contact => contact.contactType === CompanyContactType.Ocean
      )
      const airContact = companyContacts.find(
        contact => contact.contactType === CompanyContactType.Air
      )
      const customsContact = companyContacts.find(
        contact => contact.contactType === CompanyContactType.Customs
      )
      const paymentContact = companyContacts.find(
        contact => contact.contactType === CompanyContactType.Payment
      )

      oceanForm.reset({
        contactType: CompanyContactType.Ocean,
        ...oceanContact,
      })
      airForm.reset({
        contactType: CompanyContactType.Air,
        ...airContact,
      })
      customsForm.reset({
        contactType: CompanyContactType.Customs,
        ...customsContact,
      })
      paymentForm.reset({
        contactType: CompanyContactType.Payment,
        ...paymentContact,
      })
    }
  }

  const createCompanyContacts = (basicInfo: FreightForwarderBasicInfoDto) => {
    const companyContacts: CompanyContactProfileDto[] = []

    basicInfo.providerInfo?.ocean &&
      companyContacts.push(oceanForm.getValues() as CompanyContactProfileDto)

    basicInfo.providerInfo?.air &&
      companyContacts.push(airForm.getValues() as CompanyContactProfileDto)

    basicInfo.providerInfo?.customs &&
      companyContacts.push(customsForm.getValues() as CompanyContactProfileDto)

    basicInfo.providerInfo?.payment &&
      companyContacts.push(paymentForm.getValues() as CompanyContactProfileDto)

    return companyContacts
  }

  const createTriggers = (
    basicInfo: FreightForwarderBasicInfoDto | undefined
  ) => {
    const triggers = []
    basicInfo?.providerInfo?.payment && triggers.push(paymentForm.trigger())

    basicInfo?.providerInfo?.customs && triggers.push(customsForm.trigger())

    basicInfo?.providerInfo?.air && triggers.push(airForm.trigger())

    basicInfo?.providerInfo?.ocean && triggers.push(oceanForm.trigger())

    return triggers
  }

  return {
    oceanForm,
    airForm,
    customsForm,
    paymentForm,
    init,
    createCompanyContacts,
    createTriggers,
  }
}
