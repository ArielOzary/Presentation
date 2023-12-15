import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { AdminDto } from 'models'

import { api } from 'utils/api'

export const getAdminById = async (id: string): Promise<AdminDto> => {
  const { data } = await api.get(`admins/${id}`)

  return data
}

export const useGetAdminById = (
  id: string,
  options?: UseQueryOptions<AdminDto, AxiosError>
) => {
  return useQuery<AdminDto, AxiosError>(
    ['FETCH_ADMIN', id],
    getAdminById.bind(null, id),
    options
  )
}
