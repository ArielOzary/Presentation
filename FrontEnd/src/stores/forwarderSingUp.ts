import { create } from 'zustand'

import { ContactInfoSchemaType } from 'containers/Public/ClientSignUp/ContactInfo/hooks/contactInfoForm'
import { BasicInfoSchemaType } from 'containers/Public/ForwarderSignUp/BasicInfo/hooks/basicInfoForm'
import { ForwarderCompanyLocationSchemaType } from 'containers/Public/ForwarderSignUp/CompanyLocation/hooks/forwarderCompanyLocationForm'

interface ContactsInfo {
  oceanContactInfo: ContactInfoSchemaType | null
  airContactInfo: ContactInfoSchemaType | null
  customsContactInfo: ContactInfoSchemaType | null
  paymentContactInfo: ContactInfoSchemaType | null
}

interface ForwarderSignUpState extends ContactsInfo {
  basicInfo: BasicInfoSchemaType | null
  companyLocation: ForwarderCompanyLocationSchemaType | null
  setBasicInfo: (basicInfo: BasicInfoSchemaType) => void
  setContactsInfo: (contacts: ContactsInfo) => void
  setCompanyLocation: (
    companyLocation: ForwarderCompanyLocationSchemaType
  ) => void
  getState: () => Omit<
    ForwarderSignUpState,
    'setBasicInfo' | 'setContactsInfo' | 'setCompanyLocation' | 'getState'
  >
}

export const useForwarderSingUpStore = create<ForwarderSignUpState>(
  (set, get) => ({
    basicInfo: null,
    oceanContactInfo: null,
    airContactInfo: null,
    customsContactInfo: null,
    paymentContactInfo: null,
    companyLocation: null,
    setBasicInfo: (basicInfo: BasicInfoSchemaType) => {
      set(() => ({ basicInfo }))
    },
    setContactsInfo(contacts: ContactsInfo) {
      set(() => ({ ...contacts }))
    },
    setCompanyLocation(companyLocation: ForwarderCompanyLocationSchemaType) {
      set(() => ({ companyLocation }))
    },
    getState: () => {
      const {
        basicInfo,
        companyLocation,
        oceanContactInfo,
        airContactInfo,
        customsContactInfo,
        paymentContactInfo,
      } = get()

      return {
        basicInfo,
        companyLocation,
        oceanContactInfo,
        airContactInfo,
        customsContactInfo,
        paymentContactInfo,
      }
    },
  })
)
