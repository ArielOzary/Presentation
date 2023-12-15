import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { PaginatedListOfClientCustomQuoteDto, PaginationParams } from 'models'

import { api } from 'utils/api'

interface GetQuoteListRequestParams extends PaginationParams {
  id: string | undefined
}

export const getClientCustomQuote = async ({
  id,
  PageNumber = 1,
  PageSize = 10,
}: GetQuoteListRequestParams): Promise<PaginatedListOfClientCustomQuoteDto> => {
  const { data } = await api.get(`clients/${id}/custom-quotes`, {
    params: { PageNumber, PageSize },
  })
  return data
}

export const useGetClientCustomQuote = (
  pagination: GetQuoteListRequestParams,
  options?: UseQueryOptions<PaginatedListOfClientCustomQuoteDto, AxiosError>
) => {
  return useQuery<PaginatedListOfClientCustomQuoteDto, AxiosError>(
    ['CLIENT_CUSTOM_QUOTE', ...Object.values(pagination)],
    getClientCustomQuote.bind(null, pagination),
    options
  )
}
