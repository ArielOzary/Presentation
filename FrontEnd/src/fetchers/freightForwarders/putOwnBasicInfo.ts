import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UpdateOwnFreightForwarderBasicInfoCommand } from 'models'

import { api } from 'utils/api'

export const putOwnBasicInfo = async (
  dto: UpdateOwnFreightForwarderBasicInfoCommand
): Promise<string> => {
  const { data } = await api.put(
    'freight-forwarders/own-profile/basic-info',
    dto
  )

  return data
}

export const usePutOwnBasicInfo = () => {
  return useMutation<
    string,
    AxiosError,
    UpdateOwnFreightForwarderBasicInfoCommand
  >(putOwnBasicInfo)
}
