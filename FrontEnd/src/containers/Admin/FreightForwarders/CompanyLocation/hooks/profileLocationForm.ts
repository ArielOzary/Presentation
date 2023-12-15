import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { companyLocationSchema } from 'containers/Public/ClientSignUp/CompanyLocation/hooks/companyLocationForm'

const forwarderProfileLocationSchema = companyLocationSchema.omit({
  inLandByAutoLog: true,
  insurance: true,
  customClearenceByAutoLog: true,
  destinationPortId: true,
  whoIsInChargeOfInLand: true,
  termsAndConditions: true,
})

export type ForwarderProfileLocationSchemaType = z.infer<
  typeof forwarderProfileLocationSchema
>

export const useForwarderProfileLocationForm = (
  props?: UseFormProps<ForwarderProfileLocationSchemaType>
) => {
  return useForm<ForwarderProfileLocationSchemaType>({
    ...props,
    resolver: zodResolver(forwarderProfileLocationSchema),
  })
}
