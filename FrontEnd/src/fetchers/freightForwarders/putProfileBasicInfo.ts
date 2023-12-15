import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UpdateFreightForwarderBasicInfoCommand } from 'models'

import { api } from 'utils/api'

interface PutFreightForwarderProfileBasicInfoRequestParams {
  dto: UpdateFreightForwarderBasicInfoCommand
  id: string
}

export const putFreightForwardersProfileBasicInfo = async ({
  id,
  dto,
}: PutFreightForwarderProfileBasicInfoRequestParams): Promise<string> => {
  const { data } = await api.put(
    `freight-forwarders/${id}/profile/basic-info`,
    dto
  )

  return data
}

export const usePutFreightForwardersProfileBasicInfo = () => {
  return useMutation<
    string,
    AxiosError,
    PutFreightForwarderProfileBasicInfoRequestParams
  >(putFreightForwardersProfileBasicInfo)
}
