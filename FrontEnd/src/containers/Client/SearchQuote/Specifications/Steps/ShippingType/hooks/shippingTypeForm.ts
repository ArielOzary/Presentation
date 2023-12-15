import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { ShipmentIncoterms, ShipmentOption, ShipmentType } from 'models'

export const shippingTypeSchema = z.object({
  shipmentIncoterms: z.nativeEnum(ShipmentIncoterms, {
    required_error: 'searchQuote:shippingType.error',
  }),
  shipmentOption: z.nativeEnum(ShipmentOption, {
    required_error: 'searchQuote:shippingType.error',
  }),
  shipmentType: z.nativeEnum(ShipmentType, {
    required_error: 'searchQuote:shippingType.error',
  }),
  insurance: z.boolean(),
  customs: z.boolean(),
})

export type ShippingTypeSchemaType = z.infer<typeof shippingTypeSchema>

export const useShippingTypeForm = (
  props?: UseFormProps<ShippingTypeSchemaType>
) => {
  return useForm<ShippingTypeSchemaType>({
    ...props,
    resolver: zodResolver(shippingTypeSchema),
  })
}
