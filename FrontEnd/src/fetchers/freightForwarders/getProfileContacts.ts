import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { FreightForwarderContactsDto } from 'models'

import { api } from 'utils/api'

export const getFreightForwarderProfileContacts = async (
  id: string
): Promise<FreightForwarderContactsDto> => {
  const { data } = await api.get(`freight-forwarders/${id}/profile/contacts`)

  return data
}

export const useGetFreightForwarderProfileContacts = (
  id: string,
  options?: UseQueryOptions<FreightForwarderContactsDto, AxiosError>
) => {
  return useQuery<FreightForwarderContactsDto, AxiosError>(
    ['FETCH_FORWARDER_PROFILE_CONTACTS', id],
    getFreightForwarderProfileContacts.bind(null, id),
    options
  )
}
