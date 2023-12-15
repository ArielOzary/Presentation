import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

export const postSupplierFile = async (dto: FormData): Promise<string> => {
  const { data } = await api.post('supplier-files', dto)
  return data
}

export const usePostSupplierFile = () => {
  return useMutation<string, AxiosError, FormData>(postSupplierFile)
}
