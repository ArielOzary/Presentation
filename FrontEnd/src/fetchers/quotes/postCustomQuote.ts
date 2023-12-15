import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { RequestCustomQuoteCommand } from 'models'

import { api } from 'utils/api'

export const postCustomQuote = async (
  dto: RequestCustomQuoteCommand
): Promise<number[]> => {
  const { data } = await api.post('quotes/request-custom', dto)
  return data
}

export const usePostCustomQuote = () => {
  return useMutation<number[], AxiosError, RequestCustomQuoteCommand>(
    postCustomQuote
  )
}
