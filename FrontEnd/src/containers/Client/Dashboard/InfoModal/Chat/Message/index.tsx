import React, { useCallback, useEffect, useMemo } from 'react'

import { FileOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, message as antMessage } from 'antd'
import { AxiosError } from 'axios'
import cn from 'classnames'
import dayjs from 'dayjs'
import FileSaver from 'file-saver'
import { useInView } from 'react-intersection-observer'

import { useGetMessageFileByIdMutation } from 'fetchers'
import { MessageDto } from 'models'
import { useEnvStore } from 'stores/env'

import { dateTimeFormat } from 'utils/formatters'

import styles from './styles.module.scss'

interface Props {
  message: MessageDto
  isClient: boolean
  isFreightForwarder: boolean
  onReadMessage?: (id: string) => void
}

const Message: React.FC<Props> = ({
  message,
  isClient,
  isFreightForwarder,
  onReadMessage,
}) => {
  const { user } = useEnvStore()
  const isAdmin = useMemo(
    () => !isClient && !isFreightForwarder,
    [isClient, isFreightForwarder]
  )
  const isYou = useMemo(
    () => user?.id === message.userId,
    [message.userId, user?.id]
  )

  const { ref, inView } = useInView({ triggerOnce: true })

  const { mutateAsync: getFile } = useGetMessageFileByIdMutation()

  const handleFileClick = useCallback(
    async (id: string) => {
      try {
        const file = await getFile(id)

        if (file.link && file.name) {
          // FileSaver.saveAs(file.link, file.name)
          fetch(file.link)
            .then(res => res.blob())
            .then(blob => FileSaver.saveAs(blob, file.name))
        }
      } catch (e) {
        if (e instanceof Error || e instanceof AxiosError) {
          antMessage.error(e.message)
        }
      }
    },
    [message.id]
  )

  useEffect(() => {
    if (!isYou && inView && message.unread && onReadMessage) {
      onReadMessage(message.id as string)
    }
  }, [isYou, inView])

  return (
    <div
      ref={ref}
      className={cn(
        styles.wrapper,
        !isYou && styles.notYou,
        isAdmin && styles.admin
      )}
    >
      <div className={styles.message}>
        {message.body ? (
          <div className={styles.text}>{message.body}</div>
        ) : (
          <div className={styles.files}>
            {message.files?.map(file => (
              <button
                key={file.id}
                className={styles.file}
                onClick={() => handleFileClick(file.id as string)}
              >
                <FileOutlined />
                <span>{file.name}</span>
              </button>
            ))}
          </div>
        )}

        <span className={styles.time}>
          {isAdmin && <span>(Admin)</span>}
          {dayjs(message.created).format(dateTimeFormat)}
          {message.unread && <div className={styles.unread} />}
        </span>
      </div>

      <Avatar className={styles.avatar} icon={<UserOutlined />} size={40} />
    </div>
  )
}

export default Message
