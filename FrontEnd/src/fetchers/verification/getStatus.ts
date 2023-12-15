import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UserVerificationStatus } from 'models'

import { api } from 'utils/api'

export const getVerificationStatus = async (
  token: string
): Promise<UserVerificationStatus> => {
  const { data } = await api.get('verification/status', {
    params: { Token: token.split(' ').join('+') },
  })

  return data
}

export const useGetVerificationStatus = (
  token: string,
  options?: UseQueryOptions<UserVerificationStatus, AxiosError>
) => {
  return useQuery<UserVerificationStatus, AxiosError>(
    ['FETCH_USER_VALIDATION', token],
    getVerificationStatus.bind(null, token),
    options
  )
}
