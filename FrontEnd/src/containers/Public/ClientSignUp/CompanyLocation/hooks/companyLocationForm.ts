import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

export const companyLocationSchema = z.object({
  mailingAddress: z
    .string({ required_error: 'global:errors.requiredField' })
    .min(1, 'global:errors.requiredField'),
  mailingApartment: z
    .string({
      required_error: 'global:errors.required',
    })
    .regex(/^\d{1,5}$/, 'signUp:errors.companyLocation.onlyNumbers'),
  mailingPostalCode: z
    .string({
      required_error: 'global:errors.required',
    })
    .regex(/^\d{1,5}$/, 'signUp:errors.companyLocation.onlyNumbers'),
  inLandAddress: z
    .string({ required_error: 'global:errors.requiredField' })
    .min(1, 'global:errors.requiredField'),
  inLandApartment: z
    .string({
      required_error: 'global:errors.required',
    })
    .regex(/^\d{1,5}$/, 'signUp:errors.companyLocation.onlyNumbers'),
  inLandPostalCode: z
    .string({
      required_error: 'global:errors.required',
    })
    .regex(/^\d{1,5}$/, 'signUp:errors.companyLocation.onlyNumbers'),
  inLandByAutoLog: z.boolean(),
  insurance: z.boolean(),
  customClearenceByAutoLog: z.boolean(),
  destinationPortId: z.coerce.number({
    invalid_type_error: 'global:errors.requiredField',
    required_error: 'global:errors.requiredField',
  }),
  whoIsInChargeOfInLand: z
    .string({
      required_error: 'global:errors.requiredField',
    })
    .min(1, 'global:errors.requiredField'),
  comments: z.string().optional(),
  termsAndConditions: z
    .boolean()
    .refine(checked => checked, 'global:errors.requiredField'),
})

export type CompanyLocationSchemaType = z.infer<typeof companyLocationSchema>

export const useCompanyLocationForm = (
  props?: UseFormProps<CompanyLocationSchemaType>
) => {
  return useForm<CompanyLocationSchemaType>({
    ...props,
    resolver: zodResolver(companyLocationSchema),
  })
}
