import { create } from 'zustand'

import { CompanyInfoSchemaType } from 'containers/Client/SearchResults/SelectedOption/CreateSupplier/CompanyInformation/hooks/companyInfoForm'
import { ContactPersonInfoSchemaType } from 'containers/Client/SearchResults/SelectedOption/CreateSupplier/PersonOfContact/hooks/personOfContactForm'

interface SupplierStore {
  companyInfo: CompanyInfoSchemaType | null
  contactInfo: ContactPersonInfoSchemaType | null
  setCompanyInfo: (companyInfo: CompanyInfoSchemaType) => void
  setContactInfo: (contactInfo: ContactPersonInfoSchemaType) => void
}

export const useSupplierStore = create<SupplierStore>(set => ({
  companyInfo: null,
  contactInfo: null,
  setCompanyInfo: (companyInfo: CompanyInfoSchemaType) => {
    set(() => ({ companyInfo }))
  },
  setContactInfo: (contactInfo: ContactPersonInfoSchemaType) => {
    set(() => ({ contactInfo }))
  },
}))
