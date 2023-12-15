import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

export const getCountries = async (): Promise<string[]> => {
  const { data } = await api.get('geo/countries')
  return data
}

export const useGetCountries = () => {
  return useQuery<string[], AxiosError>(['COUNTRIES_LIST'], getCountries)
}
