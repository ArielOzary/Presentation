import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { FreightForwarderLocationDto } from 'models'

import { api } from 'utils/api'

export const getOwnLocation =
  async (): Promise<FreightForwarderLocationDto> => {
    const { data } = await api.get('freight-forwarders/own-profile/location')
    return data
  }

export const useGetOwnLocation = () => {
  return useQuery<FreightForwarderLocationDto, AxiosError>(
    ['GET_OWN_LOCATION'],
    getOwnLocation
  )
}
