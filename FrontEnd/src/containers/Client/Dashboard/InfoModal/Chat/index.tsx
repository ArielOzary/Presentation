import React, { useCallback, useEffect, useRef, useState } from 'react'

import { PaperClipOutlined, UploadOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Empty,
  Input,
  Spin,
  Upload,
  UploadFile,
  message,
} from 'antd'
import { UploadChangeParam } from 'antd/es/upload'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'

import ChatWrapper from 'components/ChatWrapper'
import { useChat } from 'components/ChatWrapper/hooks/useChat'
import Scrollbars, { ScrollbarRef } from 'components/Scrollbars'

import Message from './Message'

import { MessageDto } from 'models'

import { usePrevious } from 'utils/hooks/usePrevious'

import styles from './styles.module.scss'

import { ReactComponent as SendIcon } from 'assets/send.svg'

interface Props {
  conversationId: string
  clientId: string
  freightForwarderId: string
}

const Chat: React.FC<Props> = ({
  conversationId,
  clientId,
  freightForwarderId,
}) => {
  const { t } = useTranslation(['clientDashboard'])

  const scrollbarRef = useRef<ScrollbarRef | null>(null)
  const prevScrollHeight = useRef<number>(0)
  const { ref: spinnerRef, inView } = useInView()

  const [textMessage, setTextMessage] = useState('')
  const [filesMessage, setFilesMessage] = useState<UploadFile[]>([])
  const [isSending, setIsSending] = useState(false)

  const handleReceiveMessage = useCallback(() => {
    scrollbarRef.current?.scrollToBottom()
  }, [scrollbarRef])

  const {
    messages,
    data,
    hasNextPage,
    isLoading,
    fetchNextPage,
    sendTextMessage,
    sendFileMessage,
    readMessage,
  } = useChat(conversationId, handleReceiveMessage)
  const prevMessagesLength = usePrevious(messages.length)
  const prevLatestMessage = usePrevious<MessageDto | null>(
    messages.length > 0 ? messages[0] : null
  )

  const handleTextMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTextMessage(e.target.value)
    },
    []
  )

  const handleFilesMessageChange = useCallback(
    (info: UploadChangeParam<UploadFile>) => {
      setFilesMessage([info.file])
    },
    []
  )

  const handleBeforeUpload = useCallback(() => true, [])

  const handleSendMessage = useCallback(async () => {
    setIsSending(true)

    try {
      if (textMessage) {
        await sendTextMessage(textMessage)
      }

      if (filesMessage.length > 0) {
        await sendFileMessage(filesMessage)
      }

      setTextMessage('')
      setFilesMessage([])
      scrollbarRef.current?.scrollToBottom()
    } catch (e) {
      if (e instanceof Error || e instanceof AxiosError) {
        message.error(e.message)
      }
    } finally {
      setIsSending(false)
    }
  }, [textMessage, filesMessage])

  const handleNextPage = useCallback(async () => {
    await fetchNextPage()
  }, [data, scrollbarRef])

  useEffect(() => {
    if (inView && hasNextPage) {
      handleNextPage()
    }
  }, [inView, hasNextPage])

  useEffect(() => {
    const scrollHeight = scrollbarRef.current?.getScrollHeight() || 0

    if (prevMessagesLength === 0) {
      scrollbarRef.current?.scrollToBottom()
    }

    if (prevLatestMessage && prevLatestMessage.id !== messages[0].id) {
      scrollbarRef.current?.scrollToBottom()
    } else if (prevMessagesLength !== messages.length) {
      scrollbarRef.current?.scrollTop(scrollHeight - prevScrollHeight.current)
    }

    prevScrollHeight.current = scrollHeight
  }, [messages, scrollbarRef])

  return (
    <ChatWrapper chatId={conversationId}>
      <div className={styles.wrapper}>
        {messages.length > 0 ? (
          <Scrollbars ref={scrollbarRef}>
            {hasNextPage && (
              <div ref={spinnerRef}>
                <Spin size="small" className={styles.spinner} />
              </div>
            )}
            <div className={styles.chatBlock}>
              {messages.map(msg => (
                <Message
                  key={msg.id}
                  message={msg}
                  isClient={clientId === msg.userId}
                  isFreightForwarder={freightForwarderId === msg.userId}
                  onReadMessage={readMessage}
                />
              ))}
            </div>
          </Scrollbars>
        ) : (
          <div className={styles.empty}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t('clientDashboard:sendMessageToStart')}
            />
          </div>
        )}

        <div className={styles.inputBlock}>
          {filesMessage.length > 0 && (
            <Alert
              icon={<UploadOutlined />}
              message={filesMessage[0].name}
              afterClose={() => setFilesMessage([])}
              type="info"
              showIcon
              closable
            />
          )}
          <div className={styles.inputRow}>
            <Upload
              fileList={filesMessage}
              showUploadList={false}
              beforeUpload={handleBeforeUpload}
              onChange={handleFilesMessageChange}
              multiple={false}
            >
              <Button icon={<PaperClipOutlined />} size="large" type="text" />
            </Upload>
            <Input
              value={textMessage}
              onChange={handleTextMessageChange}
              placeholder={t('clientDashboard:help')}
              className={styles.input}
              onPressEnter={handleSendMessage}
              suffix={
                <Button
                  disabled={isLoading}
                  loading={isLoading}
                  type="primary"
                  icon={<SendIcon className={styles.icon} />}
                  className={styles.sendBtn}
                  onClick={handleSendMessage}
                />
              }
            />
          </div>
        </div>
      </div>
    </ChatWrapper>
  )
}

export default Chat
