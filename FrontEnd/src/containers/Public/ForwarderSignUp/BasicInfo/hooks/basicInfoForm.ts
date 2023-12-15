import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { onlyLatinHyphensSpaces, onlyNumbers, phoneRegexp } from 'utils/regexp'
import { phoneValidationSchema } from 'utils/validators/shared'

const basicInfoSchema = z.object({
  nameEn: z
    .string({ required_error: 'global:errors.requiredField' })
    .min(1, 'global:errors.requiredField')
    .regex(onlyLatinHyphensSpaces, 'signUp:errors.basicInfo.nameEnInvalid'),
  vatNumber: z
    .string({ required_error: 'global:errors.requiredField' })
    .regex(onlyNumbers, 'signUp:errors.basicInfo.vatNumberInvalid'),
  phoneNumber: phoneValidationSchema,
  fax: z
    .string({ required_error: 'global:errors.requiredField' })
    .regex(phoneRegexp, 'signUp:errors.basicInfo.faxInvalid'),
  email: z
    .string({ required_error: 'global:errors.requiredField' })
    .email('signUp:errors.basicInfo.emailInvalid'),
  customs: z.boolean(),
  air: z.boolean(),
  ocean: z.boolean(),
  payment: z.boolean(),
})

export type BasicInfoSchemaType = z.infer<typeof basicInfoSchema>

export const useBasicInfoForm = (props?: UseFormProps<BasicInfoSchemaType>) => {
  return useForm<BasicInfoSchemaType>({
    ...props,
    resolver: zodResolver(basicInfoSchema),
  })
}
