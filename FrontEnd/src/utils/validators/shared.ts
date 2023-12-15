import { z } from 'zod'

import { onlyAnyLettersHyphensSpaces, phoneRegexp } from 'utils/regexp'

export const positionValidationSchema = z
  .string({ required_error: 'global:errors.requiredField' })
  .min(1, 'global:errors.requiredField')
  .max(99, 'signUp:errors.contactInfo.positionMaxLen')
  .regex(
    onlyAnyLettersHyphensSpaces,
    'signUp:errors.contactInfo.positionInvalid'
  )

export const phoneValidationSchema = z
  .string({ required_error: 'global:errors.requiredField' })
  .regex(phoneRegexp, 'signUp:errors.contactInfo.phoneInvalid')

export const requiredNumericStringValidationSchema = z.coerce
  .number({
    required_error: 'global:errors.requiredField',
    invalid_type_error: 'global:errors.invalidNumber',
  })
  .transform(Number)
