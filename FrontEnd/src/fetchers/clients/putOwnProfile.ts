import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UpdateOwnClientProfileCommand } from 'models'

import { api } from 'utils/api'

const putOwnProfile = async (
  dto: UpdateOwnClientProfileCommand
): Promise<string> => {
  const { data } = await api.put('clients/own-profile', dto)
  return data
}

export const usePutOwnProfile = () => {
  return useMutation<string, AxiosError, UpdateOwnClientProfileCommand>(
    putOwnProfile
  )
}
