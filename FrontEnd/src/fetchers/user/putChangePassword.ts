import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ChangeUserPasswordCommand } from 'models'

import { api } from 'utils/api'

export const putUserChangePassword = async (
  dto: ChangeUserPasswordCommand
): Promise<string> => {
  const { data } = await api.put('users/change-password', dto)

  return data
}

export const usePutUserChangePassword = () => {
  return useMutation<string, AxiosError, ChangeUserPasswordCommand>(
    putUserChangePassword
  )
}
