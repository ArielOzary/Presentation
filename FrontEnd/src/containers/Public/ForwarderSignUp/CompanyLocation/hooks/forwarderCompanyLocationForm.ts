import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { companyLocationSchema } from 'containers/Public/ClientSignUp/CompanyLocation/hooks/companyLocationForm'

const forwarderCompanyLocationSchema = companyLocationSchema.omit({
  inLandByAutoLog: true,
  insurance: true,
  customClearenceByAutoLog: true,
  destinationPortId: true,
  whoIsInChargeOfInLand: true,
})

export type ForwarderCompanyLocationSchemaType = z.infer<
  typeof forwarderCompanyLocationSchema
>

export const useForwarderCompanyLocationForm = (
  props?: UseFormProps<ForwarderCompanyLocationSchemaType>
) => {
  return useForm<ForwarderCompanyLocationSchemaType>({
    ...props,
    resolver: zodResolver(forwarderCompanyLocationSchema),
  })
}
