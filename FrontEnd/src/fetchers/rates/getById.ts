import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { RateDto } from 'models'

import { api } from 'utils/api'

export const getRateById = async (id: number): Promise<RateDto> => {
  const { data } = await api.get(`rates/${id}`)

  return data
}

export const useGetRateById = (
  id: number,
  options?: UseQueryOptions<RateDto, AxiosError>
) => {
  return useQuery<RateDto, AxiosError>(
    ['FETCH_RATE', id],
    getRateById.bind(null, id),
    options
  )
}
