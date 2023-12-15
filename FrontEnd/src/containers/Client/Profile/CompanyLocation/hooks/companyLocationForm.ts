import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { companyLocationSchema } from 'containers/Public/ClientSignUp/CompanyLocation/hooks/companyLocationForm'

export const companyLocationWithoutTermsSchema = companyLocationSchema.omit({
  termsAndConditions: true,
})

export type CompanyLocationWithoutTerms = z.infer<
  typeof companyLocationWithoutTermsSchema
>

export const useCompanyLocationWithoutTerms = (
  props?: UseFormProps<CompanyLocationWithoutTerms>
) => {
  return useForm<CompanyLocationWithoutTerms>({
    ...props,
    resolver: zodResolver(companyLocationWithoutTermsSchema),
  })
}
