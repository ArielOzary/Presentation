import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { FreightForwarderContactsDto } from 'models'

import { api } from 'utils/api'

export const getOwnContacts =
  async (): Promise<FreightForwarderContactsDto> => {
    const { data } = await api.get('freight-forwarders/own-profile/contacts')
    return data
  }

export const useGetOwnContacts = () => {
  return useQuery<FreightForwarderContactsDto, AxiosError>(
    ['FETCH_OWN_CONTACTS'],
    getOwnContacts
  )
}
