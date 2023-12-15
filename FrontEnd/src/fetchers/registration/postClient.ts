import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import {
  ClientRegistrationCommand,
  ClientRegistrationResponseDto,
} from 'models'

import { api } from 'utils/api'

export const postRegistrationClient = async (
  dto: ClientRegistrationCommand
): Promise<ClientRegistrationResponseDto> => {
  const { data } = await api.post('registration/client', dto)

  return data
}

export const usePostRegistrationClient = () => {
  return useMutation<
    ClientRegistrationResponseDto,
    AxiosError,
    ClientRegistrationCommand
  >(postRegistrationClient)
}
