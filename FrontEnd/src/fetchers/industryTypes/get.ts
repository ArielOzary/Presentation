import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { IndustryTypeDto } from 'models'

import { api } from 'utils/api'

export const getIndustryTypes = async (): Promise<IndustryTypeDto[]> => {
  const { data } = await api.get('industry-type')

  return data
}

export const useGetIndustryTypes = (
  options?: UseQueryOptions<IndustryTypeDto[], AxiosError>
) => {
  return useQuery<IndustryTypeDto[], AxiosError>(
    ['FETCH_INDUSTRY_TYPES'],
    getIndustryTypes,
    options
  )
}
