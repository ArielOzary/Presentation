import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { CloseOutlined, EditOutlined } from '@ant-design/icons'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Avatar, Button, Drawer, List, Select, Spin, Tabs, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'
import { useLocation } from 'react-router-dom'

import Scrollbars from 'components/Scrollbars'

import Chat from './Chat'
import General from './General'

import { useGetShipmentById, useShipmentsMerge } from 'fetchers'
import { getShipmentIdsList } from 'fetchers/shipments/getShipmentsIdList'
import { PaginatedListOfString } from 'models'
import { useChatStore } from 'stores/chat'
import { useShipmentsDashboardStore } from 'stores/shipmentsDashboard'

import styles from './styles.module.scss'

interface Props {
  refetchShipments: () => void
}

const InfoModal: React.FC<Props> = ({ refetchShipments }) => {
  const { t, i18n } = useTranslation([
    'global',
    'quote',
    'newRate',
    'clientDashboard',
    'clientsManagement',
  ])

  const { pathname } = useLocation()
  const { ref, inView } = useInView()

  const [isUnread, setIsUnread] = useChatStore(store => [
    store.isUnread,
    store.setIsUnread,
  ])

  useEffect(() => setIsUnread(true), [])

  const [openChat, shipmentId, setOpenChat, setShipmentItem, setShipmentId] =
    useShipmentsDashboardStore(store => [
      store.openChat,
      store.shipmentId,
      store.setOpenChat,
      store.setShipmentItem,
      store.setShipmentId,
    ])

  const { data, isLoading, refetch } = useGetShipmentById(shipmentId, {
    enabled: Boolean(shipmentId),
  })
  const { mutate, isLoading: mutateIsLoading } = useShipmentsMerge()

  const [edit, setEdit] = useState<boolean>(false)
  const [value, setValue] = useState<string | undefined>(undefined)

  const {
    data: idsList,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loadingIds,
    fetchNextPage,
  } = useInfiniteQuery(
    ['SHIPMENTS_IDS_LIST'],
    ({ pageParam = 1 }) =>
      getShipmentIdsList({
        PageNumber: pageParam,
        PageSize: 5,
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.items?.length !== 0 ? allPages.length + 1 : undefined

        return nextPage
      },
    }
  )

  const handleSuccess = () => {
    value && setShipmentId(value)

    message.success('Shipment ID successfully changed')
    setEdit(false)
    setOpenChat(false)
    refetchShipments && refetchShipments()
  }

  const handleItemClick = useCallback((item: string) => {
    setValue(item)

    mutate(
      { oldShipmentId: shipmentId, newShipmentId: item },
      {
        onSuccess: handleSuccess,
        onError: error => message.error(error.message),
      }
    )
  }, [])

  const renderListItem = useCallback((page: PaginatedListOfString) => {
    return page.items?.map((item, idx) => {
      if (page.items?.length === idx + 1) {
        return (
          <button
            ref={ref}
            key={item}
            className={styles.item}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </button>
        )
      }
      return (
        <button
          key={item}
          className={styles.item}
          onClick={() => handleItemClick(item)}
        >
          {item}
        </button>
      )
    })
  }, [])

  const dropdownRender = useCallback(
    () => (
      <div className={styles.dropdown}>
        <Scrollbars style={{ height: 200 }}>
          <List dataSource={idsList?.pages} renderItem={renderListItem} />
          {isFetchingNextPage && <Spin />}
        </Scrollbars>
      </div>
    ),
    [idsList, isFetchingNextPage]
  )

  const onClose = useCallback(() => {
    setEdit(false)

    setOpenChat(false)
  }, [])

  const handleEditClick = useCallback(() => {
    setEdit(prev => !prev)
  }, [])

  const tabItems = useMemo(
    () => [
      {
        label: t('clientDashboard:general'),
        key: 'general',
        children: (
          <General
            refetchShipments={refetchShipments}
            refetch={refetch}
            loading={isLoading}
          />
        ),
      },
      {
        label: (
          <div className={styles.chatTab}>
            {t('clientDashboard:chat')}
            {data?.unread && isUnread && <span className={styles.marker} />}
          </div>
        ),
        key: 'chat',
        disabled: !data?.conversationId,
        children: (
          <Chat
            conversationId={data?.conversationId || ''}
            clientId={data?.userId || ''}
            freightForwarderId={data?.freightForwarderId || ''}
          />
        ),
      },
    ],
    [i18n.language, isLoading, data, isUnread]
  )

  useEffect(() => {
    data && setValue(data.name)
  }, [data])

  useEffect(() => {
    data && setShipmentItem(data)
  }, [data])

  useEffect(() => {
    if (inView && hasNextPage && fetchNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={openChat}
      closable={false}
      className={styles.wrapper}
      rootClassName={styles.root}
      destroyOnClose
    >
      {/* <Scrollbars> */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Avatar className={styles.avatar} />
            <div className={styles.info}>
              <span className={styles.number}>
                {t('clientsManagement:freight')} -{' '}
                {edit ? (
                  <Select
                    dropdownMatchSelectWidth={false}
                    value={value}
                    dropdownRender={dropdownRender}
                    style={{ width: 155 }}
                    loading={loadingIds || mutateIsLoading}
                  />
                ) : (
                  data?.name
                )}{' '}
                {pathname.includes('all-shipments') && (
                  <EditOutlined
                    className={styles.icon}
                    onClick={handleEditClick}
                  />
                )}
              </span>
              <span>
                {t('clientDashboard:provider')}: {data?.company}
              </span>
              <span>
                {t('clientDashboard:containers')}: {data?.containers}{' '}
              </span>
              <span>
                {t('newRate:units')}:{data?.units}, {t('quote:total')}{' '}
                {t('global:weight')} : {data?.totalWeight}{' '}
                {t('newRate:table.KG')}, {t('newRate:table.CBM')}: {data?.cbm}
              </span>
            </div>
          </div>
          <Button
            className={styles.btn}
            icon={<CloseOutlined className={styles.icon} />}
            onClick={onClose}
          />
        </div>

        <Tabs size="small" items={tabItems} className={styles.tabs} />
      </div>
      {/* </Scrollbars> */}
    </Drawer>
  )
}

export default InfoModal
