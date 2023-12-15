import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

// import { FreightForwarderContactsDto } from 'models'
import { api } from 'utils/api'

export const getExcelClient = async (id: string): Promise<any> => {
  const { data } = await api.get(`clients/${id}/export`)
  return data
}

export const useGetExcelClient = (
  id: string,
  options?: UseQueryOptions<any, AxiosError>
) => {
  return useQuery<any, AxiosError>(
    ['EXPORT_CLIENT', id],
    getExcelClient.bind(null, id),
    options
  )
}
