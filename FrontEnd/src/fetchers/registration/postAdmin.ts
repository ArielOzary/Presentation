import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { AdminRegistrationCommand } from 'models'

import { api } from 'utils/api'

export const postRegistrationAdmin = async (
  dto: AdminRegistrationCommand
): Promise<string> => {
  const { data } = await api.post('registration/admin', dto)

  return data
}

export const usePostRegistrationAdmin = () => {
  return useMutation<string, AxiosError, AdminRegistrationCommand>(
    postRegistrationAdmin
  )
}
