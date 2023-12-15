import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UpdateClientProfileCommand } from 'models'

import { api } from 'utils/api'

interface PutClientProfileRequestParams {
  dto: UpdateClientProfileCommand
  id: string
}

export const putClientProfile = async ({
  id,
  dto,
}: PutClientProfileRequestParams): Promise<void> => {
  await api.put(`clients/${id}/profile`, dto)
}

export const usePutClientProfile = () => {
  return useMutation<void | never, AxiosError, PutClientProfileRequestParams>(
    putClientProfile
  )
}
