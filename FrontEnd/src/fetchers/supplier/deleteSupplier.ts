import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

const deleteSupplier = async (id: number): Promise<string> => {
  const { data } = await api.delete(`suppliers/${id}`)
  return data
}

export const useDeleteSupplier = () => {
  return useMutation<string, AxiosError, number>(deleteSupplier)
}
