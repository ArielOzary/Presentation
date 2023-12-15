import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { PaginatedListOfRateDto, PaginationParams } from 'models'

import { api } from 'utils/api'

interface GetRatesRequestParams extends PaginationParams {
  NameQuery?: string
}

export const getRates = async ({
  PageNumber = 1,
  PageSize = 10,
  NameQuery,
}: GetRatesRequestParams): Promise<PaginatedListOfRateDto> => {
  const { data } = await api.get('rates', {   
    params: { PageNumber, PageSize, NameQuery },
  })

  console.log(data.items)

  return data
}

export const useGetRates = (
  pagination: GetRatesRequestParams,
  options?: UseQueryOptions<PaginatedListOfRateDto, AxiosError>
) => {
  return useQuery<PaginatedListOfRateDto, AxiosError>(
    ['FETCH_RATES', ...Object.values(pagination)],
    getRates.bind(null, pagination),
    options
  )
}
