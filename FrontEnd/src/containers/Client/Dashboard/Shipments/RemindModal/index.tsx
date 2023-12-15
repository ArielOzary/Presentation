import React, { useCallback, useMemo } from 'react'

import { DatePicker, Result, message } from 'antd'
import { Dayjs } from 'dayjs'
import { useTranslation } from 'react-i18next'

import { usePostForwarderRemind } from 'fetchers'
import { ShipmentListDto } from 'models'

import { useDisabledDate } from 'utils/disabledDate'
import { dateFormat } from 'utils/formatters'

import styles from './styles.module.scss'

interface Props {
  item: ShipmentListDto
  refetch: () => void
}

const RemindModal: React.FC<Props> = ({ item, refetch }) => {
  const { t, i18n } = useTranslation(['global', 'clientDashboard'])

  const { disabledTodayInclusive } = useDisabledDate()

  const { mutate: forwarderRemind } = usePostForwarderRemind()

  const onDateChange = useCallback((date: Dayjs | null) => {
    date &&
      item.previousStatusStage !== null &&
      forwarderRemind(
        {
          openStatusStage: item.previousStatusStage,
          freightForwarderId: item.freightForwarderId,
          shipmentId: item.id,
          dateToRemind: date.toISOString(),
        },
        {
          onSuccess: () => refetch(),
          onError: error => message.error(error.message),
        }
      )
  }, [])

  const extraBtns = useMemo(
    () => (
      <div className={styles.dateBlock}>
        <p>{t('clientDashboard:notificationDate')}</p>
        <DatePicker
          format={dateFormat}
          disabledDate={disabledTodayInclusive}
          onChange={onDateChange}
          showToday={false}
        />
      </div>
    ),
    [item.reminderStatus, i18n.language]
  )

  return (
    <Result
      className={styles.wrapper}
      title={t('clientDashboard:whenSetNextReminder')}
      extra={extraBtns}
    />
  )
}

export default RemindModal
