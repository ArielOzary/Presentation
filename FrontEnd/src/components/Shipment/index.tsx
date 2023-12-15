import React, { useCallback, useMemo } from 'react'

import { Button, Tag, Tooltip } from 'antd'
import cn from 'classnames'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import ProgressBar from 'components/Progress'

import DeleteCard from './DeleteCard'
import { useTagColor } from './config'

import { ShipmentListDto } from 'models'
import { useShipmentsDashboardStore } from 'stores/shipmentsDashboard'

import { useOptions } from 'utils/const'
import { useRole } from 'utils/hooks/roleHook'
import { getShipmentProgress } from 'utils/shipmentProgress'

import styles from './styles.module.scss'

interface Props {
  item: ShipmentListDto
  info?: boolean
  refetchShipments?: () => void
}

const Shipment: React.FC<Props> = ({ item, info, refetchShipments }) => {
  const { t, i18n } = useTranslation([
    'global',
    'clientsManagement',
    'clientsProfit',
    'shipments',
  ])

  const { pathname } = useLocation()
  const { admin, client } = useRole()

  const [setOpenChat, setShipmentId] = useShipmentsDashboardStore(store => [
    store.setOpenChat,
    store.setShipmentId,
  ])

  const { statusesOptions } = useOptions()

  const { tagColor } = useTagColor(item.shipmentStatusStage)

  const shipmentProgress = useMemo(
    (): number => getShipmentProgress(item.shipmentStatusStage),
    [item.shipmentStatusStage]
  )

  const status = useMemo(
    () =>
      statusesOptions.find(option => option.value === item.shipmentStatusStage)
        ?.label,
    [i18n.language, statusesOptions]
  )

  const departedDate = useMemo(
    () =>
      item.departedDate === '0001-01-01T00:00:00'
        ? '-'
        : dayjs(item.departedDate).format('DD.MM.YYYY'),
    [item]
  )

  const arrivalDate = useMemo(
    () =>
      item.arrivalDate === '0001-01-01T00:00:00'
        ? '-'
        : dayjs(item.arrivalDate).format('DD.MM.YYYY'),
    [item]
  )

  const handleShipmentClick = useCallback(() => {
    if (!info) return
    setOpenChat(true)
    item.id && setShipmentId(item.id)
  }, [])

  const onDeleteClick = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <Button
      className={cn(styles.wrapper, !info && styles.disabled)}
      onClick={handleShipmentClick}
    >
      <div className={styles.infoBlock}>
        <div className={styles.info}>
          <span className={styles.freight}>
            {item.isError && admin && <div className={styles.marker} />}{' '}
            {t('clientsManagement:freight')}- {item.name}
          </span>
          <span className={styles.provider}>{item.company}</span>
          {item.isDelayed && (
            <Tag color="error" className={styles.status}>
              {t('shipments:statuses.delayed')}
            </Tag>
          )}
          <Tag color={tagColor} className={styles.status}>
            {status}
          </Tag>
          <span className={styles.client}>
            {t('global:client')}: {item.client}
          </span>
          {!client && (
            <span className={styles.client}>
              {t('clientsProfit:profit')}: {item.profits}$
            </span>
          )}
        </div>
        <div className={styles.card}>
          <div className={cn(styles.progressBlock, styles.origin)}>
            <span className={styles.location}>
              <Tooltip placement="top" title={item.originPort}>
                {item.originPort}
              </Tooltip>
            </span>
            <div className={styles.date}>
              <p>{t('clientsManagement:departedDate')}: </p>
              <strong>{departedDate}</strong>
            </div>
          </div>
          <div className={styles.progress}>
            <ProgressBar value={shipmentProgress} />
          </div>
          <div className={cn(styles.progressBlock, styles.destination)}>
            <span className={styles.location}>
              <Tooltip placement="top" title={item.originPort}>
                {item.destinationPort}
              </Tooltip>
            </span>
            <div className={styles.date}>
              <p>{t('clientsManagement:arrivalDate')}: </p>
              <strong>{arrivalDate}</strong>
            </div>
          </div>
        </div>
      </div>
      <button className={styles.dropDown} onClick={onDeleteClick}>
        {pathname.includes('all-shipments') ? (
          <DeleteCard id={item.id} refetchShipments={refetchShipments} />
        ) : null}
      </button>
    </Button>
  )
}

export default Shipment
