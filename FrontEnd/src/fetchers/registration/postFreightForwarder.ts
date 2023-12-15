import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { FreightForwarderRegistrationCommand } from 'models'

import { api } from 'utils/api'

export const postRegistrationFreightForwarder = async (
  dto: FreightForwarderRegistrationCommand
): Promise<string> => {
  const { data } = await api.post('registration/freight-forwarder', dto)

  return data
}

export const usePostRegistrationFreightForwarder = () => {
  return useMutation<string, AxiosError, FreightForwarderRegistrationCommand>(
    postRegistrationFreightForwarder
  )
}
