import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { companyInfoSchema } from 'containers/Client/SearchResults/SelectedOption/CreateSupplier/CompanyInformation/hooks/companyInfoForm'
import { contactPersonInfoSchema } from 'containers/Client/SearchResults/SelectedOption/CreateSupplier/PersonOfContact/hooks/personOfContactForm'

const combinedSupplierSchema = companyInfoSchema.merge(
  contactPersonInfoSchema()
)

const combinedSchemaObject = combinedSupplierSchema
export type CombinedSupplierSchemaType = z.infer<typeof combinedSchemaObject>

export const useCombinedSupplierForm = (
  props?: UseFormProps<CombinedSupplierSchemaType>
) => {
  return useForm<CombinedSupplierSchemaType>({
    ...props,
    resolver: zodResolver(combinedSchemaObject),
  })
}
