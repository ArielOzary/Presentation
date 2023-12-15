import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

export const postQuoteFiles = async (dto: FormData): Promise<string> => {
  const { data } = await api.post('quote-files', dto)
  return data
}

export const usePostQuoteFiles = () => {
  return useMutation<string, AxiosError, FormData>(postQuoteFiles)
}
