import React, { useCallback, useMemo } from 'react'

import { Button, Result, message } from 'antd'
import { useTranslation } from 'react-i18next'

import { useClientRemind, useRemindSetStatus } from 'fetchers'
import { OpenStatusStage, ShipmentListDto } from 'models'

import styles from './styles.module.scss'

interface Props {
  item: ShipmentListDto
  refetch: () => void
}

const ReminderModal: React.FC<Props> = ({ item, refetch }) => {
  const { t, i18n } = useTranslation(['global', 'ffClients'])

  const { mutate: clientRemind, isLoading: clientRemindLoading } =
    useClientRemind()
  const { mutate: setStatus, isLoading } = useRemindSetStatus()

  const openStatusStage = () => {
    switch (item.openStatusStage) {
      case OpenStatusStage.ContactSupplierStatus:
        return OpenStatusStage.UploadDocumentsStatus
      case OpenStatusStage.UploadDocumentsStatus:
        return OpenStatusStage.PickupDateStatus
      default:
        return OpenStatusStage.FinishedStatus
    }
  }

  const handleYesClick = useCallback(() => {
    setStatus(
      {
        shipmentId: item.id,
        openStatusStage: openStatusStage(),
        previousStatusStage: null,
      },
      {
        onSuccess: () => refetch(),
        onError: error => message.error(error.message),
      }
    )
  }, [item])

  const handleNoClick = useCallback(() => {
    setStatus({
      shipmentId: item.id,
      openStatusStage: item.openStatusStage,
      previousStatusStage: item.openStatusStage,
    })
    clientRemind(
      {
        openStatusStage: item.openStatusStage,
        userId: item.userId,
        shipmentId: item.id,
      },
      {
        onSuccess: () => refetch(),
        onError: error => message.error(error.message),
      }
    )
  }, [item])

  const title = useMemo(() => {
    switch (
      item.previousStatusStage !== null
        ? item.previousStatusStage
        : item.openStatusStage
    ) {
      case OpenStatusStage.UploadDocumentsStatus:
        return t('ffClients:haveUploadedDocuments')
      case OpenStatusStage.PickupDateStatus:
        return t('ffClients:haveConfirmedDate')
      default:
        return t('ffClients:haveContactedSupplier')
    }
  }, [item, i18n.language])

  const extraBtns = useMemo(
    () => (
      <div className={styles.btnsBlock}>
        <Button
          size="large"
          type="primary"
          className={styles.btn}
          onClick={handleYesClick}
          loading={isLoading}
        >
          {t('global:yes')}
        </Button>

        <Button
          size="large"
          className={styles.btn}
          onClick={handleNoClick}
          loading={clientRemindLoading}
        >
          {t('ffClients:notYet')}
        </Button>
      </div>
    ),
    [item, i18n.language]
  )

  return <Result className={styles.wrapper} title={title} extra={extraBtns} />
}

export default ReminderModal
