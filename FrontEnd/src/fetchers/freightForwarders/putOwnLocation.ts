import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UpdateOwnFreightForwarderLocationCommand } from 'models'

import { api } from 'utils/api'

export const putOwnLocation = async (
  dto: UpdateOwnFreightForwarderLocationCommand
): Promise<string> => {
  const { data } = await api.put('freight-forwarders/own-profile/location', dto)

  return data
}

export const usePutOwnLocation = () => {
  return useMutation<
    string,
    AxiosError,
    UpdateOwnFreightForwarderLocationCommand
  >(putOwnLocation)
}
