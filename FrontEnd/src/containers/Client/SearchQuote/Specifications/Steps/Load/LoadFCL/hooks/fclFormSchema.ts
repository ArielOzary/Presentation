import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { ContainerType, WeightFormat } from 'models'

export const fclSchema = z.object({
  unit: z.array(
    z.object({
      unitsQuantity: z
        .number({
          required_error: 'searchQuote:load.lclForm.error.fillUnits',
          invalid_type_error: 'searchQuote:load.lclForm.error.minValue',
        })
        .gte(1, { message: 'searchQuote:load.lclForm.error.minValue' }),
      containerType: z.nativeEnum(ContainerType),
      weight: z
        .number({
          required_error: 'searchQuote:load.lclForm.error.fillTotalWeight',
          invalid_type_error: 'searchQuote:load.lclForm.error.minValue',
        })
        .min(1, { message: 'searchQuote:load.lclForm.error.minValue' }),
      weightFormat: z.nativeEnum(WeightFormat),
    })
  ),
})
export type FCLSchemaType = z.infer<typeof fclSchema>

export const useFCLForm = (props?: UseFormProps<FCLSchemaType>) => {
  return useForm<FCLSchemaType>({
    ...props,
    resolver: zodResolver(fclSchema),
  })
}

export interface LoadFieldsType {
  containerType: ContainerType
  unitsQuantity: number
  weight: number
  weightFormat: number
}

export const loadFields: LoadFieldsType = {
  containerType: ContainerType.CTR40,
  unitsQuantity: 1,
  weight: 1,
  weightFormat: WeightFormat.KG,
}
