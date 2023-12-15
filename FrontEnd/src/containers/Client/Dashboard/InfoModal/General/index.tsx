import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { RightOutlined, UpOutlined } from '@ant-design/icons'
import { Divider, Spin, message } from 'antd'
import cn from 'classnames'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import Scrollbars from 'components/Scrollbars'

import SearchBlock from '../../SearchContainer'
import GPS from './GPS'
import Step from './Step'
import UploadStatus from './UploadStep'
import UploadsBlock from './UploadsBlock'

import { usePutContainerNumber } from 'fetchers/shipments/putShipmentsTrackingName'
import { ShipmentStatusDto } from 'models'
import { useShipmentsDashboardStore } from 'stores/shipmentsDashboard'

import { useRole } from 'utils/hooks/roleHook'

import styles from './styles.module.scss'

import { ReactComponent as Pencil } from 'assets/images/pencil.svg'

interface Props {
  refetchShipments: () => void
  refetch: () => void
  loading: boolean
}

const General: React.FC<Props> = ({ refetchShipments, refetch, loading }) => {
  const { t } = useTranslation([
    'clientDashboard',
    'createSupplier',
    'newRate',
    'ffClients',
  ])

  const { client } = useRole()

  const [shipment, openChat] = useShipmentsDashboardStore(store => [
    store.shipment,
    store.openChat,
  ])
  const [value, setValue] = useState<string>('')
  const [statusSteps, setStatusSteps] = useState<ShipmentStatusDto[]>([])
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [addStatus, setAddStatus] = useState<boolean>(false)

  const { mutate, isLoading: mutateLoading } = usePutContainerNumber()

  const departedDate = useMemo(
    () =>
      shipment.departedDate === '0001-01-01T00:00:00'
        ? '-'
        : dayjs(shipment.departedDate).format('DD.MM.YYYY'),
    [shipment]
  )

  const arrivalDate = useMemo(
    () =>
      shipment.arrivalDate === '0001-01-01T00:00:00'
        ? '-'
        : dayjs(shipment.arrivalDate).format('DD.MM.YYYY'),
    [shipment]
  )

  const handleAddStatus = useCallback(() => {
    setAddStatus(true)
  }, [])

  const handleBtnClick = useCallback(() => {
    shipment.id &&
      value &&
      mutate(
        { id: shipment.id, containerNumberOrVesselName: value },
        {
          onSuccess: () => {
            message.success(t('clientDashboard:containerNumberAdded'))
            setIsEditing(false)
            refetch()
          },
          onError: error => message.error(error.message),
        }
      )
  }, [value, shipment.id])

  const handleCollapsed = useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  const handleEditContainerNumber = useCallback(() => {
    setIsEditing(prev => !prev)
    shipment.containerNumberOrVesselName &&
      setValue(shipment.containerNumberOrVesselName)
  }, [shipment.containerNumberOrVesselName])

  useEffect(() => {
    setIsCollapsed(shipment.containerNumberOrVesselName ? true : false)
  }, [shipment.containerNumberOrVesselName])

  useEffect(() => {
    if (shipment.shipmentStatus) {
      let steps: ShipmentStatusDto[] = []

      if (shipment.shipmentStatus.childrenShipmentStatuses?.length) {
        const childrenShipments = [
          ...shipment.shipmentStatus.childrenShipmentStatuses,
        ].sort(
          (a, b) => dayjs(b.created).valueOf() - dayjs(a.created).valueOf()
        )

        steps = childrenShipments
      }

      const { stage, info, created, id } = shipment.shipmentStatus

      steps.push({ stage, info, created, id })

      setStatusSteps(steps)
    }
  }, [shipment.shipmentStatus])

  useEffect(() => {
    if (!openChat) {
      setValue('')
      setIsEditing(false)
    }
  }, [openChat])

  useEffect(() => {
    return () => {
      setStatusSteps([])
    }
  }, [])

  return (
    <Scrollbars height="100%" style={{ marginLeft: 0 }}>
      <div style={{ padding: '1.5rem 1rem' }}>
        <div className={styles.originBlock}>
          <span className={styles.origin}>
            <span className={styles.date}>{departedDate}</span>
            {shipment.originPort}
          </span>
          <div className={styles.iconBlock}>
            <RightOutlined className={styles.icon} />
          </div>
          <span className={cn(styles.origin, styles.destination)}>
            <span className={styles.date}>{arrivalDate}</span>
            {shipment.destinationPort}
          </span>
        </div>
        <Spin spinning={loading}>
          {!client && (
            <button className={styles.addStatus} onClick={handleAddStatus}>
              + {t('ffClients:addStatus')}
            </button>
          )}
          <div
            className={cn(
              styles.containerSteps,
              statusSteps.length > 1 && isCollapsed && styles.collapsed
            )}
          >
            {Boolean(statusSteps.length) && (
              <>
                {addStatus && (
                  <UploadStatus
                    destination={shipment.destinationPort}
                    parentId={shipment.shipmentStatus?.id}
                    refetch={refetch}
                    setAddStatus={setAddStatus}
                    refetchShipments={refetchShipments}
                  />
                )}
                {statusSteps.map((step, idx) => (
                  <Step
                    key={step.id}
                    step={step.stage}
                    info={step.info}
                    date={step.created}
                    destination={shipment.destinationPort}
                    last={idx === 0 ? true : false}
                    id={step.id}
                    refetch={refetch}
                    refetchShipments={refetchShipments}
                  />
                ))}
                <button className={styles.wrapperStep}>
                  <div className={styles.dateBlock} />
                  <div className={styles.step} />
                </button>
              </>
            )}

            <button
              className={cn(styles.downArrow, isCollapsed && styles.collapsed)}
              onClick={handleCollapsed}
            >
              <UpOutlined className={styles.icon} />
            </button>
          </div>
        </Spin>

        {shipment.containerNumberOrVesselName ? (
          <div>
            <Spin spinning={loading}>
              <span className={styles.gpsTitle}>
                {t('clientDashboard:gpsTracker')}
              </span>
              {isEditing ? (
                <SearchBlock
                  value={value}
                  setValue={setValue}
                  handleBtnClick={handleBtnClick}
                  loading={mutateLoading}
                  label={t('clientDashboard:changeContainerNumber')}
                  className={cn(styles.vesselName, styles.margin)}
                  title={styles.title}
                />
              ) : (
                <span className={styles.containerNumber}>
                  {shipment.containerNumberOrVesselName}{' '}
                  <Pencil
                    className={styles.pencil}
                    onClick={handleEditContainerNumber}
                  />
                </span>
              )}

              <div className={styles.gpsContainer}>
                <GPS />
              </div>
            </Spin>
            <Divider className={styles.divider} />
          </div>
        ) : (
          <SearchBlock
            value={value}
            setValue={setValue}
            handleBtnClick={handleBtnClick}
            loading={mutateLoading}
            label={t('clientDashboard:addContainerNumber')}
            className={styles.vesselName}
            title={styles.title}
          />
        )}
        <UploadsBlock refetch={refetch} />
      </div>
    </Scrollbars>
  )
}

export default General
