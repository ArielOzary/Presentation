import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

export const rateCarriersSchema = z.object({
  carrierId: z
    .number({
      required_error: 'global:errors.requiredField',
      invalid_type_error: 'global:errors.requiredField',
    })
    .min(1, 'global:errors.requiredField'),
  companyId: z
    .number({
      required_error: 'global:errors.requiredField',
      invalid_type_error: 'global:errors.requiredField',
    })
    .min(1, 'global:errors.requiredField'),
})

export type RateCarriersSchemaType = z.infer<typeof rateCarriersSchema>

export const useRateCarriersForm = (
  props?: UseFormProps<RateCarriersSchemaType>
) => {
  return useForm<RateCarriersSchemaType>({
    ...props,
    resolver: zodResolver(rateCarriersSchema),
  })
}
