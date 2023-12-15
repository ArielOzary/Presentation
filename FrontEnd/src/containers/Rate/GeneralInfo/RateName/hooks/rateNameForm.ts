import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

export const rateNameSchema = z.object({
  name: z
    .string({
      required_error: 'global:errors.requiredField',
    })
    .min(1, 'global:errors.requiredField'),
})

export type RateNameSchemaType = z.infer<typeof rateNameSchema>

export const useRateNameForm = (props?: UseFormProps<RateNameSchemaType>) => {
  return useForm<RateNameSchemaType>({
    ...props,
    resolver: zodResolver(rateNameSchema),
  })
}
