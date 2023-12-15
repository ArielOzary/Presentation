import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'global:errors.requiredField' })
    .email({ message: 'forgotPassword:errors.emailInvalid' }),
})

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>

export const useForgotPasswordForm = () => {
  return useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  })
}
