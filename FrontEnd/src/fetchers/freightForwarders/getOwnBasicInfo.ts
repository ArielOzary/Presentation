import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { FreightForwarderBasicInfoDto } from 'models'

import { api } from 'utils/api'

export const getOwnBasicInfo =
  async (): Promise<FreightForwarderBasicInfoDto> => {
    const { data } = await api.get('freight-forwarders/own-profile/basic-info')

    return data
  }
export const useGetOwnBasicInfo = () => {
  return useQuery<FreightForwarderBasicInfoDto, AxiosError>(
    ['FETCH_OWN_BASIC_INFO'],
    getOwnBasicInfo
  )
}
