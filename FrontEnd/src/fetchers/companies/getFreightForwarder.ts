import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { FreightForwarderCompanyDto } from 'models'

import { api } from 'utils/api'

export const getCompaniesFreightForwarder = async (
  companyId: number
): Promise<FreightForwarderCompanyDto> => {
  const { data } = await api.get(`companies/freight-forwarder/${companyId}`)

  return data
}

export const useGetCompaniesFreightForwarder = (
  companyId: number,
  options?: UseQueryOptions<FreightForwarderCompanyDto, AxiosError>
) => {
  return useQuery<FreightForwarderCompanyDto, AxiosError>(
    ['FETCH_COMPANY_FORWARDER', companyId],
    getCompaniesFreightForwarder.bind(null, companyId),
    options
  )
}
