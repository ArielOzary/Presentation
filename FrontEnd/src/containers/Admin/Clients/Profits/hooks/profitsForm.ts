import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { requiredNumericStringValidationSchema } from 'utils/validators/shared'

export const profitsSchema = z.object({
  lcl: requiredNumericStringValidationSchema,
  fcl: requiredNumericStringValidationSchema,
  air: requiredNumericStringValidationSchema,
  customClearance: requiredNumericStringValidationSchema,
  originCharges: requiredNumericStringValidationSchema,
  destinationCharges: requiredNumericStringValidationSchema,
})

export type ProfitsSchemaType = z.infer<typeof profitsSchema>

export const useProfitsForm = (props?: UseFormProps<ProfitsSchemaType>) => {
  return useForm<ProfitsSchemaType>({
    ...props,
    resolver: zodResolver(profitsSchema),
  })
}
