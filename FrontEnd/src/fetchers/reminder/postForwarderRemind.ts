import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { RemindForwarderStatusCommand } from 'models'

import { api } from 'utils/api'

export const postForwarderRemind = async (
  dto: RemindForwarderStatusCommand
): Promise<string> => {
  const { data } = await api.post('remind/client-to-forwarder', dto)
  return data
}

export const usePostForwarderRemind = () => {
  return useMutation<string, AxiosError, RemindForwarderStatusCommand>(
    postForwarderRemind
  )
}
