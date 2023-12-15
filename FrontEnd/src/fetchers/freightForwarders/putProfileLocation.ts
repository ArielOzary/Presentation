import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UpdateFreightForwarderLocationCommand } from 'models'

import { api } from 'utils/api'

interface PutFreightForwarderProfileLocationRequestParams {
  dto: UpdateFreightForwarderLocationCommand
  id: string
}

export const putFreightForwarderProfileLocation = async ({
  id,
  dto,
}: PutFreightForwarderProfileLocationRequestParams): Promise<string> => {
  const { data } = await api.put(
    `freight-forwarders/${id}/profile/location`,
    dto
  )

  return data
}

export const usePutFreightForwarderProfileLocation = () => {
  return useMutation<
    string,
    AxiosError,
    PutFreightForwarderProfileLocationRequestParams
  >(putFreightForwarderProfileLocation)
}
