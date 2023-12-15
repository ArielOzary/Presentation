import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { OwnClientProfileDto } from 'models'

import { api } from 'utils/api'

const getOwnProfile = async (): Promise<OwnClientProfileDto> => {
  const { data } = await api.get('clients/own-profile')
  return data
}

export const useGetOwnProfile = () => {
  return useQuery<OwnClientProfileDto, AxiosError>(
    ['CLIENT_OWN_PROFILE'],
    getOwnProfile
  )
}
