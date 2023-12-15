import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { FileDto } from 'models'

import { api } from 'utils/api'

export const getQuotesFile = async (id: string): Promise<FileDto> => {
  const { data } = await api.get(`quote-files/${id}`)
  return data
}

export const useGetQuotesFileById = (
  id: string,
  options?: UseQueryOptions<FileDto, AxiosError>
) => {
  return useQuery<FileDto, AxiosError>(
    ['QUOTE_FILE', id],
    getQuotesFile.bind(null, id),
    options
  )
}
