import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

export const deleteOwnProfile = async (): Promise<string> => {
  const { data } = await api.delete('freight-forwarders/own-profile')
  return data
}

export const useDeleteOwnProfile = () => {
  return useMutation<string, AxiosError>(deleteOwnProfile)
}
