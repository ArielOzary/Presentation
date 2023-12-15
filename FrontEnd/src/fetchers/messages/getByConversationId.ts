import {
  UseInfiniteQueryOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { PaginatedListOfMessageDto } from 'models'

import { api } from 'utils/api'

interface GetMessagesByConversationIdRequestDto {
  conversationId: string
  PageNumber?: number
  PageSize?: number
}

export const getMessagesByConversationId = async ({
  conversationId,
  PageNumber = 1,
  PageSize = 10,
}: GetMessagesByConversationIdRequestDto): Promise<PaginatedListOfMessageDto> => {
  const { data } = await api.get(`messages/${conversationId}`, {
    params: { PageNumber, PageSize },
  })

  return data
}

export const useGetMessagesByConversationId = (
  props: GetMessagesByConversationIdRequestDto,
  options?: UseQueryOptions<PaginatedListOfMessageDto, AxiosError>
) => {
  const { conversationId, PageNumber, PageSize } = props

  return useQuery<PaginatedListOfMessageDto, AxiosError>(
    ['FETCH_MESSAGES', conversationId, PageNumber, PageSize],
    getMessagesByConversationId.bind(null, props),
    options
  )
}

export const useInfiniteGetMessagesByConversationId = (
  props: GetMessagesByConversationIdRequestDto,
  options?: Omit<
    UseInfiniteQueryOptions<PaginatedListOfMessageDto, AxiosError>,
    'queryKey' | 'queryFn'
  >
) => {
  const { conversationId, PageSize } = props

  return useInfiniteQuery<PaginatedListOfMessageDto, AxiosError>(
    ['FETCH_MESSAGES_INFINITE', conversationId],
    ({ pageParam = 1 }) =>
      getMessagesByConversationId({
        conversationId,
        PageNumber: pageParam,
        PageSize,
      }),
    {
      getNextPageParam: lastPage => {
        if (!lastPage.hasNextPage) {
          return undefined
        }

        const currentPage = lastPage.pageNumber || 1
        const nextPage = currentPage + 1

        return nextPage
      },
      ...options,
    }
  )
}
