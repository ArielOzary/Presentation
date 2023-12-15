import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { onlyNumbers } from 'utils/regexp'

export const originWithPortSchema = z.object({
  country: z.string({
    required_error: 'searchQuote:shippingType.error',
  }),
  portId: z.coerce.number({
    invalid_type_error: 'searchQuote:shippingType.error',
    required_error: 'searchQuote:shippingType.error',
  }),
  address: z
    .string({
      required_error: 'global:errors.requiredField',
    })
    .min(1, { message: 'global:errors.requiredField' }),
  isKnownSupplier: z.boolean().optional(),
})

export const originWithoutPortSchema = z.object({
  country: z.string({
    required_error: 'searchQuote:shippingType.error',
  }),
  city: z
    .string({
      required_error: 'searchQuote:shippingType.error',
    })
    .min(1, { message: 'searchQuote:shippingType.error' }),
  zip: z
    .string({ required_error: 'global:errors.requiredField' })
    .regex(onlyNumbers, 'signUp:errors.companyInfo.legalNumberInvalid'),
  address: z
    .string({
      required_error: 'global:errors.requiredField',
    })
    .min(1, { message: 'global:errors.requiredField' }),
  isKnownSupplier: z.boolean().optional(),
})

export type OriginWithPortSchema = z.infer<typeof originWithPortSchema>

export const useOriginWithPortForm = (
  props?: UseFormProps<OriginWithPortSchema>
) => {
  return useForm<OriginWithPortSchema>({
    ...props,
    resolver: zodResolver(originWithPortSchema),
  })
}
export type OriginWithoutPortSchema = z.infer<typeof originWithoutPortSchema>

export const useOriginWithoutPortForm = (
  props?: UseFormProps<OriginWithoutPortSchema>
) => {
  return useForm<OriginWithoutPortSchema>({
    ...props,
    resolver: zodResolver(originWithoutPortSchema),
  })
}
