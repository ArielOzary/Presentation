import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  onlyHebrewHyphensSpaces,
  onlyLatinHyphensSpaces,
  onlyLettersNumbers,
  passwordRegexp,
} from 'utils/regexp'

export const companyInfoSchema = z.object({
  nameEn: z
    .string({ required_error: 'global:errors.requiredField' })
    .min(1, 'global:errors.requiredField')
    .regex(onlyLatinHyphensSpaces, 'signUp:errors.companyInfo.nameEnInvalid'),
  nameHe: z
    .string({ required_error: 'global:errors.requiredField' })
    .min(1, 'global:errors.requiredField')
    .regex(onlyHebrewHyphensSpaces, 'signUp:errors.companyInfo.nameHeInvalid'),
  industryTypeId: z.number({
    required_error: 'global:errors.requiredField',
    invalid_type_error: 'global:errors.requiredField',
  }),
  legalNumber: z
    .string({ required_error: 'global:errors.requiredField' })
    .regex(onlyLettersNumbers, 'signUp:errors.companyInfo.legalNumberInvalid'),
  email: z
    .string({ required_error: 'global:errors.requiredField' })
    .email('signUp:errors.companyInfo.emailInvalid'),
  password: z
    .string({ required_error: 'global:errors.requiredField' })
    .regex(passwordRegexp, 'signUp:errors.companyInfo.passwordInvalid'),
  confirmPassword: z.string({
    required_error: 'global:errors.requiredField',
  }),
})

const refinedCompanyInfoSchema = companyInfoSchema.refine(
  data => data.password === data.confirmPassword,
  {
    message: 'signUp:errors.companyInfo.passwordsDoNotMatch',
    path: ['confirmPassword'],
  }
)

export type CompanyInfoSchemaType = z.infer<typeof companyInfoSchema>

export const useCompanyInfoForm = (
  props?: UseFormProps<CompanyInfoSchemaType>
) => {
  return useForm<CompanyInfoSchemaType>({
    ...props,
    resolver: zodResolver(refinedCompanyInfoSchema),
  })
}
