import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { RecoveryPasswordCommand } from 'models'

import { api } from 'utils/api'

export const postPasswordRecovery = async (
  dto: RecoveryPasswordCommand
): Promise<string> => {
  const { data } = await api.post<string>('password/recovery', dto)

  return data
}

export const usePostPasswordRecovery = () => {
  return useMutation<string, AxiosError, RecoveryPasswordCommand>(
    postPasswordRecovery
  )
}
