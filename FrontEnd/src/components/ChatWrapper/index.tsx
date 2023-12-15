import React, { useCallback, useMemo } from 'react'

import { config } from 'config'
import { createSignalRContext } from 'react-signalr'

import { ChatEventNames, useChat } from './hooks/useChat'

import securedStorage from 'utils/secureStorage'

interface Props {
  chatId: string
  children?: JSX.Element | JSX.Element[]
}

export const ChatSignalRContext = createSignalRContext({
  shareConnectionBetweenTab: false,
})

const ChatWrapper: React.FC<Props> = ({ children, chatId }) => {
  const accessToken = useMemo(() => securedStorage.getAccessToken(), [])

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

  return (
    <ChatSignalRContext.Provider
      connectEnabled={Boolean(accessToken)}
      accessTokenFactory={() => accessToken || ''}
      dependencies={[accessToken]}
      url={config.CHAT_HUB_URL}
      onOpen={() => joinChatRoom()}
      onBeforeClose={() => leaveChatRoom()}
    >
      {children}
    </ChatSignalRContext.Provider>
  )
}

export default ChatWrapper
