import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { PaginatedListOfCompanySupplierDto } from 'models'

import { api } from 'utils/api'

interface ParamsPagination {
  PageNumber: number
  PageSize: number
}

export const getSuppliers = async ({
  PageNumber = 1,
  PageSize = 10,
}: ParamsPagination): Promise<PaginatedListOfCompanySupplierDto> => {
  const { data } = await api.get('suppliers', {
    params: { PageNumber, PageSize },
  })

  return data
}

export const useGetSuppliers = (params: ParamsPagination) => {
  return useQuery<PaginatedListOfCompanySupplierDto, AxiosError>(
    ['FETCH_SUPPLIERS', ...Object.values(params)],
    getSuppliers.bind(null, params)
  )
}
