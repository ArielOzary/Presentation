import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { CloseOutlined } from '@ant-design/icons'
import { Button, Input, Select, Tag, message } from 'antd'
import cn from 'classnames'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { useTagColor } from 'components/Shipment/config'

import { useDeleteShipmentStatus, usePutShipmentStatus } from 'fetchers'
import { ShipmentStatusStage } from 'models'

import { useOptions } from 'utils/const'
import { useRole } from 'utils/hooks/roleHook'

import styles from './styles.module.scss'

interface Props {
  step?: ShipmentStatusStage
  info?: string
  date?: string
  destination?: string
  last: boolean
  id: number | undefined
  refetch: () => void
  refetchShipments: () => void
}

const Step: React.FC<Props> = ({
  step,
  info,
  date,
  destination,
  last,
  id,
  refetch,
  refetchShipments,
}) => {
  const { t, i18n } = useTranslation([
    'global',
    'clientDashboard',
    'clientsProfit',
    'shipments',
    'newRate',
  ])

  const { client } = useRole()

  const { statusesOptions } = useOptions()
  const { tagColor } = useTagColor(step)

  const [updated, setUpdated] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [editStatus, setEditStatus] = useState<boolean>(false)
  const [statusValue, setStatusValue] = useState<
    ShipmentStatusStage | undefined
  >(step)
  const [infoValue, setInfoValue] = useState<string | undefined>(info)

  const { mutate: mutateUpdateStatus, isLoading: loadingUpdateStatus } =
    usePutShipmentStatus()
  const { mutate: deleteStatus, isLoading: loadingDeleteStatus } =
    useDeleteShipmentStatus()

  const status = useMemo(
    () => statusesOptions.find(option => option.value === step)?.label,
    [i18n.language, statusesOptions]
  )

  const handleStepClick = useCallback(() => {
    !client && setEditStatus(true)
  }, [])

  const handleCloseForm = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setEditStatus(false)
    setInfoValue(info)
  }, [])

  const handleSelect = (value: ShipmentStatusStage) => {
    setStatusValue(value)
  }

  const handleInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInfoValue(e.currentTarget.value)
  }

  const handleSuccess = () => {
    setEditStatus(false)
    refetch()
    refetchShipments && refetchShipments()
  }

  const handleSuccessUpdate = () => {
    message.success(t('shipments:statusSuccessfullyChanged'))
    handleSuccess()
  }

  const handleSaveClick = () => {
    id &&
      mutateUpdateStatus(
        { id, stage: statusValue, info: infoValue },
        { onSuccess: handleSuccessUpdate }
      )
  }

  const handleSuccessDelete = () => {
    message.success(t('shipments:statusSuccessfullyDeleted'))
    setEditStatus(false)
    refetch()
    refetchShipments && refetchShipments()
  }

  const handleDeleteClick = () => {
    id &&
      deleteStatus(id, {
        onSuccess: handleSuccessDelete,
        onError: error => {
          if (error.code === 'HAS_NO_ACCESS') {
            return message.error(t('shipments:impossibleToDelete'))
          }
          return message.error(error.message)
        },
      })
  }

  useEffect(() => {
    setUpdated(dayjs(date).format('ddd, MMM D'))
    setTime(dayjs(date).format('HH:mm'))
  }, [date])

  useEffect(() => {
    setStatusValue(step)
  }, [editStatus])

  useEffect(() => {
    setInfoValue(info)
  }, [info])

  return (
    <button
      className={cn(styles.wrapperStep, !client && styles.cursor)}
      onClick={handleStepClick}
    >
      <div className={styles.dateBlock}>
        <p className={styles.date}>{updated}</p>
        <span className={styles.time}>{time}</span>
      </div>
      <div className={cn(styles.step, !last && styles.stepNotActive)}>
        {editStatus ? (
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
        ) : (
          <Tag color={tagColor} className={styles.tag}>
            {status}
          </Tag>
        )}
        <span className={styles.destination}>{destination}</span>
        {info && !editStatus && (
          <>
            <p className={styles.infoTitle}>{t('clientDashboard:info')}:</p>
            <span className={styles.info}>{info}</span>
          </>
        )}
        {editStatus && (
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
        )}

        {editStatus && (
          <div className={styles.editBtns}>
            <Button
              type="primary"
              className={styles.editBtn}
              onClick={handleSaveClick}
              loading={loadingUpdateStatus}
            >
              {t('global:save')}
            </Button>
            <Button
              danger
              className={styles.editBtn}
              onClick={handleDeleteClick}
              loading={loadingDeleteStatus}
            >
              {t('global:delete')}
            </Button>
          </div>
        )}
      </div>
    </button>
  )
}

export default Step
