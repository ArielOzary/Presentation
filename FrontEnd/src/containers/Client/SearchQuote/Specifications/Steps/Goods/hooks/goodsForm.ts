import { zodResolver } from '@hookform/resolvers/zod'
import { RcFile, UploadFile } from 'antd/es/upload'
import dayjs, { Dayjs } from 'dayjs'
import { UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

import { CurrencyType } from 'models'

export const defaultValues = {
  description: '',
  currencyValue: '',
  currencyType: CurrencyType.USD,
  shippingDate: dayjs() as unknown as string,
  dangerous: false,
  unNumber: '',
  file: undefined,
}

export const goodsFormSchema = z
  .object({
    description: z
      .string()
      .min(1, { message: 'searchQuote:goods.errors.shippingItemsError' })
      .max(50, { message: 'searchQuote:goods.errors.limited' }),
    value: z
      .number({
        required_error: 'searchQuote:goods.errors.goodsValueError',
        invalid_type_error: 'searchQuote:goods.errors.goodsValueError',
      })
      .gte(1, { message: 'searchQuote:load.lclForm.error.minValue' }),
    currencyType: z.nativeEnum(CurrencyType),
    shippingDate: z
      .instanceof(dayjs as unknown as typeof Dayjs, {
        message: 'searchQuote:goods.errors.shippingDateError',
      })
      .transform(date => date.utcOffset(0, true).startOf('date').toISOString()),
    dangerous: z.boolean(),
    un: z.coerce.string().transform(Number).optional(),
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
  .refine(data => !(data.dangerous && !data.un), {
    message: 'searchQuote:goods.errors.unNumberError',
    path: ['un'],
  })

export type GoodsSchemaType = z.infer<typeof goodsFormSchema>

export const useGoodsForm = (props?: UseFormProps<GoodsSchemaType>) => {
  return useForm<GoodsSchemaType>({
    ...props,
    resolver: zodResolver(goodsFormSchema),
  })
}
