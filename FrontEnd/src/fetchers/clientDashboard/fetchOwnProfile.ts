import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ClientProfileDto } from 'models'

import { api } from 'utils/api'

export const fetchOwnProfile = async (): Promise<ClientProfileDto> => {
  const { data } = await api.get('clients/own-profile')

  return data
}

export const useFetchOwnProfile = () => {
  return useQuery<ClientProfileDto, AxiosError>(
    ['FETCH_OWN_PROFILE'],
    fetchOwnProfile
  )
}
