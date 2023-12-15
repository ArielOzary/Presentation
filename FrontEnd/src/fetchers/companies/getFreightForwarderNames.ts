import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import {
  PaginatedListOfFreightForwarderCompanyNameDto,
  PaginationParams,
} from 'models'

import { api } from 'utils/api'

interface GetCompaniesFreightForwarderNamesRequestParams
  extends PaginationParams {
  CompanyNameQuery?: string
}

export const getCompaniesFreightForwarderNames = async ({
  PageNumber = 1,
  PageSize = 10,
  CompanyNameQuery,
}: GetCompaniesFreightForwarderNamesRequestParams): Promise<PaginatedListOfFreightForwarderCompanyNameDto> => {
  const { data } = await api.get('companies/freight-forwarder-names', {
    params: { PageNumber, PageSize, CompanyNameQuery },
  })

  return data
}

export const useGetCompaniesFreightForwarderNames = (
  params: GetCompaniesFreightForwarderNamesRequestParams,
  options?: UseQueryOptions<
    PaginatedListOfFreightForwarderCompanyNameDto,
    AxiosError
  >
) => {
  return useQuery<PaginatedListOfFreightForwarderCompanyNameDto, AxiosError>(
    ['FETCH_FREIGHT_FORWARDER_NAMES', ...Object.values(params)],
    getCompaniesFreightForwarderNames.bind(null, params),
    options
  )
}
