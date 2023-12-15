import React, { useCallback, useState } from 'react'

import { CloseOutlined } from '@ant-design/icons'
import { Button, Input, Select, message } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { usePostShipmentStatus } from 'fetchers'
import { ShipmentStatusStage } from 'models'

import { useOptions } from 'utils/const'

import styles from './styles.module.scss'

interface Props {
  destination?: string
  parentId: number | undefined
  refetch: () => void
  setAddStatus: (value: boolean) => void
  refetchShipments: () => void
}

const UploadStatus: React.FC<Props> = ({
  destination,
  parentId,
  refetch,
  setAddStatus,
  refetchShipments,
}) => {
  const { t } = useTranslation([
    'global',
    'clientDashboard',
    'shipments',
    'newRate',
  ])

  const { mutate: mutateAddStatus, isLoading: loadingStatus } =
    usePostShipmentStatus()

  const { statusesOptions } = useOptions()

  const [statusValue, setStatusValue] = useState<
    ShipmentStatusStage | undefined
  >(statusesOptions[0].value)
  const [infoValue, setInfoValue] = useState<string>('')

  const handleSelect = (value: ShipmentStatusStage) => {
    setStatusValue(value)
  }
  const handleCloseForm = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setStatusValue(undefined)
    setInfoValue('')
    setAddStatus(false)
  }, [])

  const handleInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInfoValue(e.currentTarget.value)
  }

  const handleSuccessAdd = () => {
    message.success(t('shipments:statusSuccessfullyAdded'))
    setStatusValue(undefined)
    setInfoValue('')
    setAddStatus(false)
    refetch()
    refetchShipments && refetchShipments()
  }

  const handleSaveClick = () => {
    if (parentId) {
      mutateAddStatus(
        { parentId: parentId, stage: statusValue, info: infoValue },
        {
          onSuccess: handleSuccessAdd,
          onError: error => {
            if (error.code === 'HAS_NO_ACCESS') {
              return message.error(t('shipments:addShipmentStatusError'))
            }
            return message.error(error.message)
          },
        }
      )
    }
  }

  return (
    <button className={styles.wrapperStep}>
      <div className={styles.dateBlock}>
        <p className={styles.date}>{dayjs().format('ddd, MMM D')}</p>
        <span className={styles.time}>{dayjs().format('HH:mm')}</span>
      </div>
      <div className={styles.step}>
        <>
          <Select
            className={styles.select}
            options={statusesOptions}
            value={statusValue}
            onSelect={handleSelect}
          />
          <CloseOutlined
            className={styles.iconClose}
            onClick={handleCloseForm}
          />
        </>
        <span className={styles.destination}>{destination}</span>
        <>
          <p className={styles.infoTitle}>
            {t('clientDashboard:info')} ({t('newRate:optional')}):
          </p>

          <Input.TextArea
            autoSize
            value={infoValue}
            onChange={handleInfoChange}
            className={styles.textArea}
          />
        </>
        <div className={styles.editBtns}>
          <Button
            type="primary"
            className={styles.editBtn}
            onClick={handleSaveClick}
            loading={loadingStatus}
          >
            {t('global:save')}
          </Button>
        </div>
      </div>
    </button>
  )
}

export default UploadStatus
