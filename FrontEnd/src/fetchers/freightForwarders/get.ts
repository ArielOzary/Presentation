import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { PaginatedListOfFreightForwarderDto, PaginationParams } from 'models'

import { api } from 'utils/api'

interface GetFreightForwardersRequestParams extends PaginationParams {
  CompanyNameQuery?: string
}

export const getFreightForwarders = async ({
  PageNumber = 1,
  PageSize = 10,
  CompanyNameQuery,
}: GetFreightForwardersRequestParams): Promise<PaginatedListOfFreightForwarderDto> => {
  const { data } = await api.get('freight-forwarders', {
    params: { PageNumber, PageSize, CompanyNameQuery },
  })

  return data
}

export const useGetFreightForwarders = (
  params: GetFreightForwardersRequestParams,
  options?: UseQueryOptions<PaginatedListOfFreightForwarderDto, AxiosError>
) => {
  return useQuery<PaginatedListOfFreightForwarderDto, AxiosError>(
    ['FETCH_FREIGHT_FORWARDERS', ...Object.values(params)],
    getFreightForwarders.bind(null, params),
    options
  )
}
