import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

export const deleteSupplierFile = async (id: string): Promise<string> => {
  const { data } = await api.delete(`supplier-files/${id}`)
  return data
}

export const useDeleteSupplierFile = () => {
  return useMutation<string, AxiosError, string>(deleteSupplierFile)
}
