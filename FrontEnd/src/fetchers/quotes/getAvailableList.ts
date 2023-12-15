import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { AvailableQuotesListDto, GetAvailableQuotesQuery } from 'models'

import { api } from 'utils/api'

export const getAvailableList = async (
  dto: GetAvailableQuotesQuery
): Promise<AvailableQuotesListDto> => {
  const params = {
    ...dto,
  }
  const { data } = await api.post('quotes/available-list', params)

  return data
}

export const useGetAvailableList = () => {
  return useMutation<
    AvailableQuotesListDto,
    AxiosError,
    GetAvailableQuotesQuery
  >(getAvailableList)
}
