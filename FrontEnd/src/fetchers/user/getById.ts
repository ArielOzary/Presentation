import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UserDto } from 'models'

import { api } from 'utils/api'

export const getUserById = async (id: string): Promise<UserDto> => {
  const { data } = await api.get<UserDto>(`users/${id}`)

  return data
}

export const useGetUserById = (
  id: string,
  options?: UseQueryOptions<UserDto, AxiosError>
) => {
  return useQuery<UserDto, AxiosError>(
    ['FETCH_USER', id],
    getUserById.bind(null, id),
    options
  )
}
