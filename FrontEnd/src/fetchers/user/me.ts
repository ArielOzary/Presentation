import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UserRole } from 'models'

import { api } from 'utils/api'

export interface UserRoleResponseDto {
  id: string
  name: UserRole
}

export interface UserMeResponseDto {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  isDeactivated: boolean
  locale: string
  status: number
  created: string
  createdBy: string | null
  lastModified: string
  lastModifiedBy: string | null
  roles: UserRoleResponseDto[]
}

export const userMe = async (): Promise<UserMeResponseDto> => {
  const { data } = await api.get<UserMeResponseDto>('users/me')

  return data
}

export const useUserMe = (
  options?: UseQueryOptions<UserMeResponseDto, AxiosError>
) => {
  return useQuery<UserMeResponseDto, AxiosError>(
    ['FETCH_USER_ME'],
    userMe,
    options
  )
}
