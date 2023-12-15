import React, { useCallback } from 'react'

import { CloseOutlined, FormOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

interface Props {
  children: React.ReactNode
}
const Wrapper: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation(['global'])

  const [isEditing, setIsEditing] = useProfileStore(
    store => [store.isEditing, store.setIsEditing],
    shallow
  )

  const toggleEdit = useCallback(() => {
    setIsEditing(!isEditing)
  }, [isEditing])

  return (
    <div className={styles.wrapper}>
      <Button
        size="large"
        type="text"
        icon={
          isEditing ? (
            <CloseOutlined className={styles.icon} />
          ) : (
            <FormOutlined className={styles.icon} />
          )
        }
        className={styles.editBtn}
        onClick={toggleEdit}
      >
        {isEditing ? t('global:cancel') : t('global:edit')}
      </Button>
      {children}
    </div>
  )
}

export default Wrapper
