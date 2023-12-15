import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const signInSchema = z.object({
  email: z
    .string({ required_error: 'signIn:errors.emailRequired' })
    .email({ message: 'signIn:errors.emailInvalid' }),
  password: z
    .string({ required_error: 'global:errors.requiredField' })
    .min(1, 'global:errors.requiredField'),
})

export type SignInSchemaType = z.infer<typeof signInSchema>

export const useSignInForm = () => {
  return useForm<SignInSchemaType>({ resolver: zodResolver(signInSchema) })
}
