import { InfiniteData } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'

import { PaginatedListOfMessageDto } from 'models'

import { queryClient } from 'utils/queryClient'

export const clientUpdateReadMessages = (
  chatId: string,
  messageIds: string[]
) => {
  queryClient.setQueryData<InfiniteData<PaginatedListOfMessageDto>>(
    ['FETCH_MESSAGES_INFINITE', chatId],
    prev => {
      if (!prev) {
        return prev
      }
      const data = cloneDeep(prev)

      for (const page of data.pages) {
        for (const message of page.items || []) {
          if (messageIds.includes(message.id as string)) {
            message.unread = false
          }
        }
      }

      return data
    }
  )
}
