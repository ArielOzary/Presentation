import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { SetUserActivationStatusCommand } from 'models'

import { api } from 'utils/api'

interface PutUserActivationStatusRequestParams {
  id: string
  dto: SetUserActivationStatusCommand
}

export const putUserActivationStatus = async ({
  id,
  dto,
}: PutUserActivationStatusRequestParams): Promise<string> => {
  const { data } = await api.put(`users/${id}/activation-status`, dto)

  return data
}

export const usePutUserActivationStatus = () => {
  return useMutation<string, AxiosError, PutUserActivationStatusRequestParams>(
    putUserActivationStatus
  )
}
