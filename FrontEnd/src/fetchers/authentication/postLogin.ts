import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { TokenResultDto } from 'models'
import { LoginRequest } from 'models/identity'

import { identity } from 'utils/api'

export const postAuthenticationLogin = async (
  dto: LoginRequest
): Promise<TokenResultDto> => {
  const { data } = await identity.post<TokenResultDto>(
    'authentication/login',
    dto
  )

  return data
}

export const usePostAuthenticationLogin = () => {
  return useMutation<TokenResultDto, AxiosError, LoginRequest>(
    postAuthenticationLogin
  )
}
