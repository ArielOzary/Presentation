import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UserDto } from 'models'

import { api } from 'utils/api'

export const getUserMe = async (): Promise<UserDto> => {
  const { data } = await api.get<UserDto>('users/me')

  return data
}

export const useGetUserMe = (
  options?: UseQueryOptions<UserDto, AxiosError>
) => {
  return useQuery<UserDto, AxiosError>(['FETCH_USER_ME'], getUserMe, options)
}
