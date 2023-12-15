import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { onlyLettersNumbers, phoneRegexp } from 'utils/regexp'
import {
  phoneValidationSchema,
  positionValidationSchema,
} from 'utils/validators/shared'

const adminSignUpSchema = z.object({
  companyName: z
    .string({ required_error: 'global:errors.requiredField' })
    .min(1, 'global:errors.requiredField'),
  legalNumber: z
    .string({ required_error: 'global:errors.requiredField' })
    .regex(onlyLettersNumbers, 'signUp:errors.companyInfo.legalNumberInvalid'),
  jobTitle: positionValidationSchema,
  phoneNumber: phoneValidationSchema,
  fax: z
    .string({ required_error: 'global:errors.requiredField' })
    .regex(phoneRegexp, 'adminSignUp:errors.faxInvalid'),
})

export type AdminSignUpSchemaType = z.infer<typeof adminSignUpSchema>

export const useAdminSignUpForm = (
  props?: UseFormProps<AdminSignUpSchemaType>
) => {
  return useForm<AdminSignUpSchemaType>({
    ...props,
    resolver: zodResolver(adminSignUpSchema),
  })
}
