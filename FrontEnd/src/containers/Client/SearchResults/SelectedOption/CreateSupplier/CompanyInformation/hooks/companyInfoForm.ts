import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { phoneRegexp } from 'utils/regexp'

export const companyInfoSchema = z.object({
  companyName: z
    .string({ required_error: 'createSupplier:errors.companyName' })
    .min(1, 'global:errors.requiredField'),
  companyPhoneNumber: z
    .string({ required_error: 'createSupplier:errors.phone' })
    .regex(phoneRegexp, 'signUp:errors.contactInfo.phoneInvalid'),
  companyAddress: z
    .string({ required_error: 'createSupplier:errors.address' })
    .min(1, 'global:errors.requiredField'),
  companyApartment: z
    .string({
      required_error: 'global:errors.required',
    })
    .regex(/^\d{1,5}$/, 'signUp:errors.companyLocation.onlyNumbers'),
  companyPostalCode: z
    .string({
      required_error: 'global:errors.required',
    })
    .regex(/^\d{1,5}$/, 'signUp:errors.companyLocation.onlyNumbers'),
})

export type CompanyInfoSchemaType = z.infer<typeof companyInfoSchema>

export const useCompanyInfoForm = (
  props?: UseFormProps<CompanyInfoSchemaType>
) => {
  return useForm<CompanyInfoSchemaType>({
    ...props,
    resolver: zodResolver(companyInfoSchema),
  })
}
