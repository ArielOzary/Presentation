import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { onlyLatinHyphensSpaces } from 'utils/regexp'
import {
  phoneValidationSchema,
  positionValidationSchema,
} from 'utils/validators/shared'

export const contactInfoSchema = z.object({
  id: z.number().optional(),
  contactType: z.number().optional(),
  name: z
    .string({ required_error: 'global:errors.requiredField' })
    .min(1, 'global:errors.requiredField')
    .regex(
      onlyLatinHyphensSpaces,
      'signUp:errors.contactInfo.contactNameInvalid'
    ),
  jobTitle: positionValidationSchema,
  email: z
    .string({ required_error: 'global:errors.requiredField' })
    .email('signUp:errors.contactInfo.emailInvalid'),
  phoneNumber: phoneValidationSchema,
})

const contactInfoSchemaObject = contactInfoSchema
export type ContactInfoSchemaType = z.infer<typeof contactInfoSchemaObject>

export const useContactInfoForm = (
  props?: UseFormProps<ContactInfoSchemaType>
) => {
  return useForm<ContactInfoSchemaType>({
    ...props,
    resolver: zodResolver(contactInfoSchema),
  })
}
