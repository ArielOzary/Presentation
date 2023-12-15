import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { TemporaryLoginAccessCommand, TokenResultDto } from 'models'

import { api } from 'utils/api'

export const postPasswordExchangeToken = async ({
  token = '',
}: TemporaryLoginAccessCommand): Promise<TokenResultDto> => {
  const { data } = await api.post<TokenResultDto>('password/exchange-token', {
    token: token.split(' ').join('+'),
  })

  return data
}

export const usePostPasswordExchangeToken = () => {
  return useMutation<TokenResultDto, AxiosError, TemporaryLoginAccessCommand>(
    postPasswordExchangeToken
  )
}
