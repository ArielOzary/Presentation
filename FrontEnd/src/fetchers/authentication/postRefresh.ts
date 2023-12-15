import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { TokenResultDto } from 'models'

import { postAuthenticationRefresh } from 'utils/api'

export const usePostAuthenticationRefresh = () => {
  return useMutation<TokenResultDto, AxiosError>(postAuthenticationRefresh)
}
