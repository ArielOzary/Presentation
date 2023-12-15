import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { phoneValidationSchema } from 'utils/validators/shared'

export const contactUsSchema = z.object({
  name: z
    .string({ required_error: 'global:errors.requiredField' })
    .min(1, 'global:errors.requiredField'),
  companyName: z
    .string({ required_error: 'global:errors.requiredField' })
    .min(1, 'global:errors.requiredField'),
  email: z
    .string({ required_error: 'global:errors.requiredField' })
    .email('clientContactUs:errors.email'),
  phoneNumber: phoneValidationSchema,
  message: z
    .string({ required_error: 'global:errors.requiredField' })
    .min(1, 'global:errors.requiredField'),
})

export type ContactUsSchemaType = z.infer<typeof contactUsSchema>

export const useContactUsForm = (props?: UseFormProps<ContactUsSchemaType>) => {
  return useForm<ContactUsSchemaType>({
    ...props,
    resolver: zodResolver(contactUsSchema),
  })
}
