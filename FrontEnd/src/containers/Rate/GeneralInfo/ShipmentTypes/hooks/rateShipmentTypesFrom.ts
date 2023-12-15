import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

export const rateShipmentTypesSchema = z.object({
  shipmentType: z.number({ required_error: 'global:errors.requiredField' }),
  shipmentIncoterms: z.number({
    required_error: 'global:errors.requiredField',
  }),
  shipmentOption: z.number({ required_error: 'global:errors.requiredField' }),
})

export type RateShipmentTypesSchemaType = z.infer<
  typeof rateShipmentTypesSchema
>

export const useRateShipmentTypesForm = (
  props?: UseFormProps<RateShipmentTypesSchemaType>
) => {
  return useForm<RateShipmentTypesSchemaType>({
    ...props,
    resolver: zodResolver(rateShipmentTypesSchema),
  })
}
