import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { PaginatedListOfRateDto, PaginationParams } from 'models'

import { api } from 'utils/api'

interface GetRatesRequestParams extends PaginationParams {
  NameQuery?: string
}

export const getRatesOwn = async ({
  PageNumber = 1,
  PageSize = 10,
  NameQuery,
}: GetRatesRequestParams): Promise<PaginatedListOfRateDto> => {
  const { data } = await api.get('rates/own', {
    params: { PageNumber, PageSize, NameQuery },
  })
  return data
}

export const useGetRatesOwn = (
  pagination: GetRatesRequestParams,
  options?: UseQueryOptions<PaginatedListOfRateDto, AxiosError>
) => {
  return useQuery<PaginatedListOfRateDto, AxiosError>(
    ['FETCH_RATES_OWN', ...Object.values(pagination)],
    getRatesOwn.bind(null, pagination),
    options
  )
}
