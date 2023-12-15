import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { FreightForwarderLocationDto } from 'models'

import { api } from 'utils/api'

export const getFreightForwarderProfileLocation = async (
  id: string
): Promise<FreightForwarderLocationDto> => {
  const { data } = await api.get(`freight-forwarders/${id}/profile/location`)

  return data
}

export const useGetFreightForwarderProfileLocation = (
  id: string,
  options?: UseQueryOptions<FreightForwarderLocationDto, AxiosError>
) => {
  return useQuery<FreightForwarderLocationDto, AxiosError>(
    ['FETCH_FORWARDER_PROFILE_LOCATION', id],
    getFreightForwarderProfileLocation.bind(null, id),
    options
  )
}
