import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { companyInfoSchema } from 'containers/Public/ClientSignUp/CompanyInfo/hooks/companyInfoForm'

export const companyInfoSchemaWithoutPassword = companyInfoSchema.omit({
  password: true,
  confirmPassword: true,
})

export type CompanyInfoWithoutPassword = z.infer<
  typeof companyInfoSchemaWithoutPassword
>

export const useCompanyInfoWithoutPassword = (
  props?: UseFormProps<CompanyInfoWithoutPassword>
) => {
  return useForm<CompanyInfoWithoutPassword>({
    ...props,
    resolver: zodResolver(companyInfoSchemaWithoutPassword),
  })
}
