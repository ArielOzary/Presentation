import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { FreightForwarderBasicInfoDto } from 'models'

import { api } from 'utils/api'

export const getFreightForwarderProfileBasicInfo = async (
  id: string
): Promise<FreightForwarderBasicInfoDto> => {
  const { data } = await api.get(`freight-forwarders/${id}/profile/basic-info`)

  return data
}

export const useGetFreightForwarderProfileBasicInfo = (
  id: string,
  options?: UseQueryOptions<FreightForwarderBasicInfoDto, AxiosError>
) => {
  return useQuery<FreightForwarderBasicInfoDto, AxiosError>(
    ['FETCH_FORWARDER_PROFILE_BASIC_INFO', id],
    getFreightForwarderProfileBasicInfo.bind(null, id),
    options
  )
}
