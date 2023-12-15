import { zodResolver } from '@hookform/resolvers/zod'
import { DeepPartial, UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { companyInfoSchema } from 'containers/Public/ClientSignUp/CompanyInfo/hooks/companyInfoForm'
import { companyLocationSchema } from 'containers/Public/ClientSignUp/CompanyLocation/hooks/companyLocationForm'
import { contactInfoSchema } from 'containers/Public/ClientSignUp/ContactInfo/hooks/contactInfoForm'

import { ClientProfileDto } from 'models'

export const clientProfileSchema = z.object({
  companyProfile: companyInfoSchema.omit({
    password: true,
    confirmPassword: true,
  }),
  companyContact: contactInfoSchema,
  companyLocation: companyLocationSchema.omit({ termsAndConditions: true }),
})

export type ClientProfileSchemaType = z.infer<typeof clientProfileSchema>

export const useClientProfileForm = (
  props?: UseFormProps<ClientProfileSchemaType>
) => {
  return useForm<ClientProfileSchemaType>({
    ...props,
    resolver: zodResolver(clientProfileSchema),
  })
}

export const convertClientProfileToForm = (
  profile?: ClientProfileDto
): DeepPartial<ClientProfileSchemaType> => {
  const { companyProfile, companyContact, companyLocation } = profile || {}

  return {
    companyProfile: companyProfile
      ? {
          ...companyProfile,
          industryTypeId: companyProfile.industryTypeId || undefined,
        }
      : undefined,
    companyContact: companyContact || undefined,
    companyLocation: companyLocation
      ? {
          ...companyLocation,
          destinationPortId: companyLocation.destinationPortId || undefined,
        }
      : undefined,
  }
}
