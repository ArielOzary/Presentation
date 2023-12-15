import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { passwordRegexp } from 'utils/regexp'

const changePasswordSchema = z
  .object({
    password: z
      .string({ required_error: 'global:errors.requiredField' })
      .regex(passwordRegexp, 'signUp:errors.companyInfo.passwordInvalid'),
    confirmPassword: z.string({
      required_error: 'global:errors.requiredField',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'signUp:errors.companyInfo.passwordsDoNotMatch',
    path: ['confirmPassword'],
  })

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>

export const useChangePasswordForm = (
  props?: UseFormProps<ChangePasswordSchemaType>
) => {
  return useForm<ChangePasswordSchemaType>({
    ...props,
    resolver: zodResolver(changePasswordSchema),
  })
}
