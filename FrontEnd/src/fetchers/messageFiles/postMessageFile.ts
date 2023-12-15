import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

export const postMessageFile = async (dto: FormData): Promise<string> => {
  const { data } = await api.post('message-files', dto)
  return data
}

export const usePostMessageFile = () => {
  return useMutation<string, AxiosError, FormData>(postMessageFile)
}
