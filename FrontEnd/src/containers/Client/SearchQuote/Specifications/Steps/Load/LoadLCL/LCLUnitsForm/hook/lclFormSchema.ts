import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  CalculationOption,
  DimensionsFormat,
  PackageType,
  WeightFormat,
} from 'models'

export const lclSchema = z.object({
  unit: z.array(
    z.object({
      packageType: z.nativeEnum(PackageType),
      unitsQuantity: z
        .number({
          required_error: 'searchQuote:load.lclForm.error.fillUnits',
          invalid_type_error: 'searchQuote:load.lclForm.error.minValue',
        })
        .gte(1, { message: 'searchQuote:load.lclForm.error.minValue' }),
      weightPerUnit: z
        .number({
          required_error: 'searchQuote:load.lclForm.error.fillWeight',
          invalid_type_error: 'searchQuote:load.lclForm.error.fillWeight',
        })
        .gte(1, { message: 'searchQuote:load.lclForm.error.minValue' }),
      length: z
        .number({
          required_error: 'global:errors.required',
          invalid_type_error: 'global:errors.required',
        })
        .gte(1, { message: 'searchQuote:load.lclForm.error.minValue' }),
      width: z
        .number({
          required_error: 'global:errors.required',
          invalid_type_error: 'global:errors.required',
        })
        .gte(1, { message: 'searchQuote:load.lclForm.error.minValue' }),
      height: z
        .number({
          required_error: 'global:errors.required',
          invalid_type_error: 'global:errors.required',
        })
        .gte(1, { message: 'searchQuote:load.lclForm.error.minValue' }),
      dimensionsFormat: z.nativeEnum(DimensionsFormat),
      weightFormat: z.nativeEnum(WeightFormat),
      calculationOption: z.nativeEnum(CalculationOption).optional(),
    })
  ),
})

export type LCLSchemaType = z.infer<typeof lclSchema>

export const useLCLForm = (props?: UseFormProps<LCLSchemaType>) => {
  return useForm<LCLSchemaType>({
    ...props,
    resolver: zodResolver(lclSchema),
  })
}

export interface UnitFieldsType {
  packageType: PackageType
  unitsQuantity: number
  weightPerUnit: number
  length: number
  width: number
  height: number
  dimensionsFormat: number
  weightFormat: number
}

export const unitFields: UnitFieldsType = {
  packageType: PackageType.Pallets,
  unitsQuantity: 1,
  weightPerUnit: 1,
  length: 1,
  width: 1,
  height: 1,
  dimensionsFormat: DimensionsFormat.Cm,
  weightFormat: WeightFormat.KG,
}
