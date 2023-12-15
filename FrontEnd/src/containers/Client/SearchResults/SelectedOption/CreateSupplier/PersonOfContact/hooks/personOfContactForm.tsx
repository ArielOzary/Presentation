import { zodResolver } from '@hookform/resolvers/zod'
import { RcFile, UploadFile } from 'antd/es/upload'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { onlyLatinHyphensSpaces, phoneRegexp } from 'utils/regexp'

export const contactPersonInfoSchema = () =>
  z.object({
    contactName: z
      .string({ required_error: 'createSupplier:errors.name' })
      .min(1, 'global:errors.requiredField')
      .regex(
        onlyLatinHyphensSpaces,
        'signUp:errors.contactInfo.contactNameInvalid'
      ),
    phoneNumber: z
      .string({ required_error: 'createSupplier:errors.phone' })
      .regex(phoneRegexp, 'signUp:errors.contactInfo.phoneInvalid'),
    email: z
      .string({ required_error: 'global:errors.requiredField' })
      .email('signUp:errors.contactInfo.emailInvalid'),
    comments: z.string().nullish().optional(),
    file: z
      .object({
        file: z.custom<RcFile>(
          val => val && typeof val === 'object' && 'uid' in val,
          'Select file'
        ),
        fileList: z
          .custom<UploadFile>(
            val => val && typeof val === 'object' && 'uid' in val,
            'Select file'
          )
          .array(),
      })
      .optional(),
  })

const contactPersonInfoSchemaObject = contactPersonInfoSchema()
export type ContactPersonInfoSchemaType = z.infer<
  typeof contactPersonInfoSchemaObject
>

export const useContactPersonInfoForm = (
  props?: UseFormProps<ContactPersonInfoSchemaType>
) => {
  return useForm<ContactPersonInfoSchemaType>({
    ...props,
    resolver: zodResolver(contactPersonInfoSchema()),
  })
}
