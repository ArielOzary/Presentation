import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ReadMessagesRangeCommand } from 'models'

import { api } from 'utils/api'

interface PostConversationReadRangeRequestParams {
  messagesIds: string[]
  id: string
}

export const postConversationReadRange = async ({
  id,
  messagesIds,
}: PostConversationReadRangeRequestParams): Promise<ReadMessagesRangeCommand> => {
  const { data } = await api.post(`conversations/${id}/read-range`, {
    messagesIds,
  })
  return data
}

export const usePostConversationReadRange = () => {
  return useMutation<
    ReadMessagesRangeCommand,
    AxiosError,
    PostConversationReadRangeRequestParams
  >(postConversationReadRange)
}
