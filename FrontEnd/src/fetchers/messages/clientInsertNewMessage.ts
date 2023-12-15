import { InfiniteData } from '@tanstack/react-query'
import { chunk, get } from 'lodash'

import { MessageDto, PaginatedListOfMessageDto } from 'models'

import { queryClient } from 'utils/queryClient'

export const clientInsertNewMessage = (
  chatId: string,
  message: MessageDto,
  pageSize: number
) => {
  queryClient.setQueryData<InfiniteData<PaginatedListOfMessageDto>>(
    ['FETCH_MESSAGES_INFINITE', chatId],
    prev => {
      if (!prev) {
        return prev
      }

      const data: InfiniteData<PaginatedListOfMessageDto> = {
        pages: [],
        pageParams: prev?.pageParams || [],
      }
      const messages = prev?.pages
        ? prev.pages.flatMap(page => page?.items || [])
        : []
      const pages = chunk([message, ...messages], pageSize)

      const totalCount = get(prev, ['pages', 0, 'totalCount'], 0) + 1
      const totalPages = Math.ceil(totalCount / pageSize)

      data.pages = pages.map((items, index) => {
        const pageNumber = index + 1

        return {
          items,
          totalPages,
          totalCount,
          pageNumber,
          hasPreviousPage: index > 0,
          hasNextPage: pageNumber < totalPages,
        }
      })

      return data
    }
  )
}
