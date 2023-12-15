import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { PortDto } from 'models'

import { api } from 'utils/api'

export const getPortById = async (id: number): Promise<PortDto> => {
  const { data } = await api.get(`ports/${id}`)

  return data
}

export const useGetPortById = (
  id: number,
  options?: UseQueryOptions<PortDto, AxiosError>
) => {
  return useQuery<PortDto, AxiosError>(
    ['PORT_BY_ID', id],
    getPortById.bind(null, id),
    options
  )
}
