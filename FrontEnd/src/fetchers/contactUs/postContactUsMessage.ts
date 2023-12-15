import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

interface ContactUsSendMessage {
  FirstName: string
  CompanyName: string
  Email: string
  Phone: string
  Message: string
}

export const postContactUsMessageClient = async (
  dto: ContactUsSendMessage
): Promise<string> => {
  const { data } = await api.post('contactus', dto)
  return data
}

export const usePostContactUsMessage = () => {
  return useMutation<string, AxiosError, ContactUsSendMessage>(
    postContactUsMessageClient
  )
}
