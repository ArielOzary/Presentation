import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { BaseCurrencyRatesDto } from 'models'

import { api } from 'utils/api'

export const exchangeRate = async (): Promise<BaseCurrencyRatesDto[]> => {
  const { data } = await api.get('currency-exchange-rates')
  return data
}

export const useExchangeRate = () => {
  return useQuery<BaseCurrencyRatesDto[], AxiosError>(
    ['EXCHANGE_RATES'],
    exchangeRate
  )
}
