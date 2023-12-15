import { useCallback, useEffect, useState } from 'react'

import { ChatSignalRContext } from '..'
import { useDebounce } from 'usehooks-ts'

import { ChatEventNames } from './useChat'

import {
  clientUpdateReadMessages,
  usePostConversationReadRange,
} from 'fetchers'
import { useChatStore } from 'stores/chat'

export const useChatReadMessage = (chatId: string) => {
  const { mutateAsync: postConversationReadRange } =
    usePostConversationReadRange()

  const setIsUnread = useChatStore(store => store.setIsUnread)

  const [readMesssageIds, setReadMessageIds] = useState<string[]>([])
  const debouncedReadMessageIds = useDebounce(readMesssageIds, 2000)

  const readMessage = useCallback((id: string) => {
    setReadMessageIds(messageIds => [id, ...messageIds])
  }, [])

  const postReadMessageIds = useCallback(async () => {
    if (debouncedReadMessageIds.length < 1) {
      return
    }

    try {
      await postConversationReadRange({
        id: chatId,
        messagesIds: debouncedReadMessageIds,
      }).then(resp => setIsUnread(Boolean(resp.unread)))

      setReadMessageIds([])
    } catch (e) {}
  }, [debouncedReadMessageIds])

  const handleReadMessage = useCallback((messageIds: string[]) => {
    clientUpdateReadMessages(chatId, messageIds)
  }, [])

  useEffect(() => {
    postReadMessageIds()
  }, [debouncedReadMessageIds])

  ChatSignalRContext.useSignalREffect(
    ChatEventNames.ReadMessages,
    handleReadMessage,
    []
  )

  return { readMessage }
}
