import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

export const deleteMyProfile = async (): Promise<string> => {
  const { data } = await api.delete('clients/own-profile')
  return data
}

export const useDeleteOwnClientProfile = () => {
  return useMutation<string, AxiosError>(deleteMyProfile)
}
