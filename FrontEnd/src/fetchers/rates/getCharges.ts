import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { RateChargesDetailsDto } from 'models'

import { api } from 'utils/api'

export const getRateCharges = async (
  id: number
): Promise<RateChargesDetailsDto> => {
  const { data } = await api.get(`rates/${id}/charges`)

  return data
}

export const useGetRateCharges = (
  id: number,
  options?: UseQueryOptions<RateChargesDetailsDto, AxiosError>
) => {
  return useQuery<RateChargesDetailsDto, AxiosError>(
    ['FETCH_RATE_CHARGES', id],
    getRateCharges.bind(null, id),
    options
  )
}
