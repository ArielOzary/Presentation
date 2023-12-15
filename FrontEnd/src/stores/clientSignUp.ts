import { create } from 'zustand'

import { CompanyInfoSchemaType } from 'containers/Public/ClientSignUp/CompanyInfo/hooks/companyInfoForm'
import { CompanyLocationSchemaType } from 'containers/Public/ClientSignUp/CompanyLocation/hooks/companyLocationForm'
import { ContactInfoSchemaType } from 'containers/Public/ClientSignUp/ContactInfo/hooks/contactInfoForm'

interface ClientSignUpState {
  companyInfo: CompanyInfoSchemaType | null
  contactInfo: ContactInfoSchemaType | null
  companyLocation: CompanyLocationSchemaType | null
  setCompanyInfo: (companyInfo: CompanyInfoSchemaType) => void
  setContactInfo: (contactInfo: ContactInfoSchemaType) => void
  setCompanyLocation: (companyLocation: CompanyLocationSchemaType) => void
  getState: () => Pick<
    ClientSignUpState,
    'companyInfo' | 'contactInfo' | 'companyLocation'
  >
}

export const useClientSignUpStore = create<ClientSignUpState>((set, get) => ({
  companyInfo: null,
  contactInfo: null,
  companyLocation: null,
  setCompanyInfo: (companyInfo: CompanyInfoSchemaType) => {
    set(() => ({ companyInfo }))
  },
  setContactInfo: (contactInfo: ContactInfoSchemaType) => {
    set(() => ({ contactInfo }))
  },
  setCompanyLocation: (companyLocation: CompanyLocationSchemaType) => {
    set(() => ({ companyLocation }))
  },
  getState: () => {
    const { companyInfo, companyLocation, contactInfo } = get()
    return { companyInfo, companyLocation, contactInfo }
  },
}))
