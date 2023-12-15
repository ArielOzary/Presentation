import { useCallback, useMemo } from 'react'

import { ChatSignalRContext } from '..'
import { UploadFile } from 'antd'

import { useChatReadMessage } from './useChatReadMessage'

import {
  clientInsertNewMessage,
  useInfiniteGetMessagesByConversationId,
  usePostMessageFile,
} from 'fetchers'
import { MessageDto } from 'models'

export enum ChatEventNames {
  JoinChatRoom = 'JoinChatRoom',
  LeaveChatRoom = 'LeaveChatRoom',
  SendMessage = 'SendMessage',
  ReceiveMessage = 'ReceiveMessage',
  ReadMessages = 'ReadMessages',
}

const PAGE_SIZE = 10

export const useChat = (chatId: string, onReceiveMessage?: () => void) => {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    refetch,
  } = useInfiniteGetMessagesByConversationId({
    conversationId: chatId,
    PageSize: PAGE_SIZE,
  })

  const { mutateAsync: postMessageFile } = usePostMessageFile()
  const { readMessage } = useChatReadMessage(chatId)

  const sendTextMessage = useCallback(async (text: string) => {
    if (ChatSignalRContext.connection?.state === 'Connected') {
      await ChatSignalRContext.invoke(ChatEventNames.SendMessage, {
        ChatId: chatId,
        Message: text,
      })
    }
  }, [])

  const sendFileMessage = useCallback(
    (files: UploadFile[]): Promise<string> => {
      const formData = new FormData()

      formData.append('ConversationId', chatId)
      for (const file of files) {
        formData.append('Files', file.originFileObj as unknown as File)
      }

      return postMessageFile(formData)
    },
    []
  )

  const joinChatRoom = useCallback(async () => {
    if (ChatSignalRContext.connection?.state === 'Connected') {
      await ChatSignalRContext.invoke(ChatEventNames.JoinChatRoom, chatId)
    }
  }, [])

  const leaveChatRoom = useCallback(async () => {
    if (ChatSignalRContext.connection?.state === 'Connected') {
      await ChatSignalRContext.invoke(ChatEventNames.LeaveChatRoom, chatId)
    }
  }, [])

  const handleReceiveMessage = useCallback(
    (message: MessageDto) => {
      clientInsertNewMessage(chatId, message, PAGE_SIZE)

      if (onReceiveMessage) {
        onReceiveMessage()
      }
    },
    [chatId]
  )

  const messages = useMemo(
    () => (data?.pages ? data.pages.flatMap(page => page?.items || []) : []),
    [data]
  )

  ChatSignalRContext.useSignalREffect(
    ChatEventNames.ReceiveMessage,
    handleReceiveMessage,
    [chatId]
  )

  return {
    messages,
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    sendTextMessage,
    sendFileMessage,
    joinChatRoom,
    leaveChatRoom,
    readMessage,
  }
}
