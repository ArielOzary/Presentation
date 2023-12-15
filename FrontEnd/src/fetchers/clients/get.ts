import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { PaginatedListOfClientDto, PaginationParams } from 'models'

import { api } from 'utils/api'

export interface GetClientsRequestParams extends PaginationParams {
  CompanyNameQuery?: string
}

export const getClients = async ({
  PageNumber = 1,
  PageSize = 10,
  CompanyNameQuery,
}: GetClientsRequestParams): Promise<PaginatedListOfClientDto> => {
  const { data } = await api.get('clients', {
    params: { PageNumber, PageSize, CompanyNameQuery },
  })

  return data
}

export const useGetClients = (
  pagination: GetClientsRequestParams,
  options?: UseQueryOptions<PaginatedListOfClientDto, AxiosError>
) => {
  return useQuery<PaginatedListOfClientDto, AxiosError>(
    ['FETCH_CLIENTS', ...Object.values(pagination)],
    getClients.bind(null, pagination),
    options
  )
}
