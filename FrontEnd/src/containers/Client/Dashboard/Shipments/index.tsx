import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { List, Pagination, Spin } from 'antd'
import { useLocation, useParams } from 'react-router-dom'

import Shipment from 'components/Shipment'

import InfoModal from 'containers/Client/Dashboard/InfoModal'

import RemindModal from './RemindModal'

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

import { paramsByType } from 'utils/getParamsByType'
import { useRole } from 'utils/hooks/roleHook'

import styles from './styles.module.scss'

const Shipments: React.FC = () => {
  const { tab } = useParams<{ tab: string }>()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const { admin } = useRole()

  const [shipmentsList, setShipmentsList] = useState<
    ShipmentListDto[] | undefined
  >(undefined)

  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number | undefined>(0)

  const sortBy = useSortShipmentsStore(store => store.sortBy)
  const [searchByNumber, searchByKeyWords, openChat, setFiltersData] =
    useShipmentsDashboardStore(store => [
      store.searchByNumber,
      store.searchByKeyWords,
      store.openChat,
      store.setFiltersData,
    ])

  const filtersData = useMemo(() => {
    const statusList = paramsByType({ type: 'status', queryParams })
    const providersList = paramsByType({
      type: 'providers',
      queryParams,
    })
    const shipmentTypeList = paramsByType({
      type: 'shipmentType',
      queryParams,
    })
    const shipmentOptionsList = paramsByType({
      type: 'shipmentOptions',
      queryParams,
    })
    const clientsList = paramsByType({
      type: 'clients',
      queryParams,
    })

    const data: ShipmentFilterDto = {}
    if (providersList)
      data.clientCompanyFilter = { companyIds: providersList as number[] }
    if (clientsList)
      data.clientCompanyFilter = { clientIds: clientsList as string[] }

    if (searchByNumber)
      data.searchFilter = { containerNumberOrVesselName: searchByNumber }
    if (searchByKeyWords) data.searchFilter = { search: searchByKeyWords }
    if (shipmentTypeList)
      data.tosFilter = { shipmentTypes: shipmentTypeList as number[] }
    if (shipmentOptionsList)
      data.tosFilter = { shipmentOptions: shipmentOptionsList as number[] }
    if (tab === 'history')
      data.tosFilter = { shipmentStatuses: [ShipmentStatusStage.Delivered] }
    if (statusList)
      data.tosFilter = { shipmentStatuses: statusList as number[] }

    return data
  }, [location, tab, searchByNumber, searchByKeyWords])

  const { data, isLoading, refetch } = useGetShipmentsList({
    ...filtersData,
    sortOption: sortBy,
    pageNumber,
    pageSize,
  })

  const renderList = useCallback(
    (item: ShipmentListDto) => {
      return (
        <List.Item className={styles.item} key={item.id}>
          <Shipment item={item} refetchShipments={refetch} info />
          {!admin &&
            item.shipmentStatusStage !== ShipmentStatusStage.Delivered &&
            item.openStatusStage !== OpenStatusStage.FinishedStatus &&
            item.reminderStatus === ReminderStatus.ClientReminder && (
              <RemindModal item={item} refetch={refetch} />
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
    if (data) {
      setShipmentsList(data.items)
      setTotalCount(data.totalCount)
    }
  }, [data])

  useEffect(() => {
    setFiltersData(filtersData)
  }, [filtersData])

  return (
    <Spin spinning={isLoading}>
      <List
        dataSource={shipmentsList || []}
        renderItem={renderList}
        className={styles.list}
      />
      <Pagination
        showSizeChanger
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
