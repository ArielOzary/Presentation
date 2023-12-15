import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { PaginatedListOfAdminDto, PaginationParams } from 'models'

import { api } from 'utils/api'

interface GetAdminsRequestParams extends PaginationParams {
  CompanyNameQuery?: string
}

export const getAdmins = async ({
  PageNumber = 1,
  PageSize = 10,
  CompanyNameQuery,
}: GetAdminsRequestParams): Promise<PaginatedListOfAdminDto> => {
  const { data } = await api.get('admins', {
    params: { PageNumber, PageSize, CompanyNameQuery },
  })

  return data
}

export const useGetAdmins = (
  pagination: GetAdminsRequestParams,
  options?: UseQueryOptions<PaginatedListOfAdminDto, AxiosError>
) => {
  return useQuery<PaginatedListOfAdminDto, AxiosError>(
    ['FETCH_ADMINS', ...Object.values(pagination)],
    getAdmins.bind(null, pagination),
    options
  )
}
