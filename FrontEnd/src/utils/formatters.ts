import { IMask } from 'antd-mask-input-for-andtv5'

import { CurrencyType } from 'models'

export const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

export const eurFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
})

export const ilsFormatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  maximumFractionDigits: 2,
})

export const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
})

export const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 2,
})

export const phoneInputMask = '+0-000-000-00000'
export const phoneFormatter = IMask.createMask({
  mask: phoneInputMask,
})

export const dateFormat = 'DD.MM.YY'
export const dateTimeFormat = 'DD.MM.YY HH:mm'

export const formatCurrency = (
  value: number,
  currency: CurrencyType = CurrencyType.USD
) => {
  return new Intl.NumberFormat(
    currency === CurrencyType.USD
      ? 'en-US'
      : currency === CurrencyType.EUR
      ? 'de-DE'
      : 'he-IL',
    {
      style: 'currency',
      currency:
        currency === CurrencyType.USD
          ? 'USD'
          : currency === CurrencyType.EUR
          ? 'EUR'
          : 'ILS',
      maximumFractionDigits: 2,
    }
  ).format(value)
}
