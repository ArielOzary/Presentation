import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { CalculationOption, VolumeFormat, WeightFormat } from 'models'

export const lclShipmentSchema = z.object({
  unitsQuantity: z
    .number({
      required_error: 'searchQuote:load.lclForm.error.fillUnits',
      invalid_type_error: 'searchQuote:load.lclForm.error.minValue',
    })
    .gte(1, { message: 'searchQuote:load.lclForm.error.minValue' }),
  volume: z
    .number({
      required_error: 'searchQuote:load.lclForm.error.fillTotalVolume',
      invalid_type_error: 'searchQuote:load.lclForm.error.fillTotalVolume',
    })
    .gte(1, { message: 'searchQuote:load.lclForm.error.minValue' }),
  volumeFormat: z.nativeEnum(VolumeFormat),
  weight: z
    .number({
      required_error: 'searchQuote:load.lclForm.error.fillTotalWeight',
      invalid_type_error: 'searchQuote:load.lclForm.error.fillTotalWeight',
    })
    .gte(1, { message: 'searchQuote:load.lclForm.error.minValue' }),
  weightFormat: z.nativeEnum(WeightFormat),
  calculationOption: z.nativeEnum(CalculationOption).optional(),
})

export type LCLShipmentSchemaType = z.infer<typeof lclShipmentSchema>

export const useLCLShipmentForm = (
  props?: UseFormProps<LCLShipmentSchemaType>
) => {
  return useForm<LCLShipmentSchemaType>({
    ...props,
    resolver: zodResolver(lclShipmentSchema),
  })
}
