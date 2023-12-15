import { zodResolver } from '@hookform/resolvers/zod'
import dayjs, { Dayjs } from 'dayjs'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

export const rateExpirationSchema = z
  .object({
    startDate: z
      .instanceof(dayjs as unknown as typeof Dayjs, {
        message: 'global:errors.requiredField',
      })
      .transform(date => date.utcOffset(0).startOf('date').toISOString()),
    endDate: z
      .instanceof(dayjs as unknown as typeof Dayjs, {
        message: 'global:errors.requiredField',
      })
      .transform(date => date.utcOffset(0).endOf('date').toISOString()),
  })
  .refine(data => data.endDate > data.startDate, {
    message: 'newRate:endDateInvalid',
    path: ['endDate'],
  })

export type RateExpirationSchemaType = z.infer<typeof rateExpirationSchema>

export const useRateExpirationForm = (
  props?: UseFormProps<RateExpirationSchemaType>
) => {
  return useForm<RateExpirationSchemaType>({
    ...props,
    resolver: zodResolver(rateExpirationSchema),
  })
}
