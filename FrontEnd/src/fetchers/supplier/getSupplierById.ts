import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { CompanySupplierDetailDto } from 'models'

import { api } from 'utils/api'

const getSupplierById = async (
  id: number
): Promise<CompanySupplierDetailDto> => {
  const { data } = await api.get(`suppliers/${id}`)
  return data
}

export const useGetSupplierById = (
  id: number,
  options?: UseQueryOptions<CompanySupplierDetailDto, AxiosError>
) => {
  return useQuery<CompanySupplierDetailDto, AxiosError>(
    ['SUPPLIER_BY_ID', id],
    getSupplierById.bind(null, id),
    options
  )
}
