import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { RemindClientStatusCommand } from 'models'

import { api } from 'utils/api'

export const clientRemind = async (
  dto: RemindClientStatusCommand
): Promise<string> => {
  const { data } = await api.post('remind/forwarder-to-client', dto)
  return data
}

export const useClientRemind = () => {
  return useMutation<string, AxiosError, RemindClientStatusCommand>(
    clientRemind
  )
}
