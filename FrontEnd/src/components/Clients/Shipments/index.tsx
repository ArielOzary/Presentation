import React, { useCallback, useEffect, useState } from 'react'

import { List, Pagination, Spin } from 'antd'
import { useParams } from 'react-router-dom'

import Shipment from 'components/Shipment'
import SortShipments from 'components/SortShipments'

import InfoModal from 'containers/Client/Dashboard/InfoModal'
import ReminderModal from 'containers/FreightForwarder/Dashboard/ReminderModal'

import { useGetShipmentsList } from 'fetchers'
import {
  OpenStatusStage,
  ReminderStatus,
  ShipmentFilterDto,
  ShipmentListDto,
  ShipmentStatusStage,
} from 'models'
import { useShipmentsDashboardStore } from 'stores/shipmentsDashboard'
import { useSortShipmentsStore } from 'stores/sortShipments'

import { useRole } from 'utils/hooks/roleHook'

import styles from './styles.module.scss'

const Shipments: React.FC = () => {
  const { id, tab } = useParams<{ id: string; tab: string }>()

  const { freightForwarder } = useRole()

  const openChat = useShipmentsDashboardStore(store => store.openChat)

  const [shipmentsList, setShipmentsList] = useState<
    ShipmentListDto[] | undefined
  >(undefined)
  const [totalCount, setTotalCount] = useState<number | undefined>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [filteredShipments, setFilteredShipments] = useState<ShipmentFilterDto>(
    {}
  )
  const sortBy = useSortShipmentsStore(store => store.sortBy)

  const { data, isLoading, refetch } = useGetShipmentsList(
    {
      ...filteredShipments,
      sortOption: sortBy,
      pageNumber,
      pageSize,
    },
    { enabled: Boolean(id) && Boolean(Object.keys(filteredShipments).length) }
  )

  const renderList = useCallback(
    (item: ShipmentListDto) => {
      return (
        <List.Item className={styles.item} key={item.id}>
          <Shipment item={item} info />
          {freightForwarder &&
            item.openStatusStage !== OpenStatusStage.FinishedStatus &&
            item.reminderStatus === ReminderStatus.FFReminder && (
              <ReminderModal item={item} refetch={refetch} />
            )}
        </List.Item>
      )
    },
    [data]
  )

  const handlePaginationChange = useCallback(
    (page: number, pageSize: number) => {
      setPageSize(pageSize)
      setPageNumber(page)
    },
    []
  )

  useEffect(() => {
    const shipment: ShipmentFilterDto = {}

    if (id) shipment.clientCompanyFilter = { clientIds: [id] }

    if (tab === 'history')
      shipment.tosFilter = { shipmentStatuses: [ShipmentStatusStage.Delivered] }

    if (sortBy) shipment.sortOption = sortBy

    setFilteredShipments(shipment)
  }, [id, tab, location, sortBy, pageNumber, pageSize])

  useEffect(() => {
    if (data) {
      setShipmentsList(data.items)
      setTotalCount(data.totalCount)
    }
  }, [data])

  return (
    <Spin spinning={isLoading}>
      <SortShipments />
      <List
        dataSource={shipmentsList || []}
        renderItem={renderList}
        className={styles.list}
      />
      <Pagination
        showSizeChanger
        hideOnSinglePage
        current={pageNumber}
        pageSize={pageSize}
        total={totalCount}
        onChange={handlePaginationChange}
        className={styles.pagination}
      />
      {openChat && <InfoModal refetchShipments={refetch} />}
    </Spin>
  )
}

export default Shipments
