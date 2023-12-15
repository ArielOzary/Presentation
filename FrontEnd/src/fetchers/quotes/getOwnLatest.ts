import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ClientQuoteDto } from 'models'

import { api } from 'utils/api'

export const getOwnLatestSearch = async (): Promise<ClientQuoteDto[]> => {
  const { data } = await api.get('quotes/own-latest')

  return data
}

export const useGetOwnLatestSearch = () => {
  return useQuery<ClientQuoteDto[], AxiosError>(
    ['LATEST_SEARCH'],
    getOwnLatestSearch
  )
}
