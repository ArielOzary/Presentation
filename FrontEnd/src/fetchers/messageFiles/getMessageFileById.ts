import { UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { FileDto } from 'models'

import { api } from 'utils/api'

export const getMessageFileById = async (id: string): Promise<FileDto> => {
  const { data } = await api.get(`message-files/${id}`)
  return data
}

export const useGetMessageFileById = (
  id: string,
  options?: UseQueryOptions<FileDto, AxiosError>
) => {
  return useQuery<FileDto, AxiosError>(
    ['MESSAGE_FILE', id],
    getMessageFileById.bind(null, id),
    options
  )
}

export const useGetMessageFileByIdMutation = () => {
  return useMutation<FileDto, AxiosError, string>(getMessageFileById)
}
