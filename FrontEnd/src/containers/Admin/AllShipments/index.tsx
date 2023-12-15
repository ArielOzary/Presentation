import React, { useCallback, useMemo } from 'react'

import { Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import SortShipments from 'components/SortShipments'

import Shipments from 'containers/Client/Dashboard/Shipments'
import SideBar from 'containers/Client/Dashboard/SideBar'

import styles from './styles.module.scss'

const AllShipments: React.FC = () => {
  const { t, i18n } = useTranslation(['global', 'clientsManagement'])

  const params = useParams()
  const navigate = useNavigate()

  const tabsChange = useCallback(
    (tab: string) => {
      navigate(`/admin/all-shipments/${tab}`)
    },
    [params]
  )

  const tabItems = useMemo(
    () => [
      {
        label: t('clientsManagement:activeTab'),
        key: 'active',
        children: <Shipments />,
      },
      {
        label: t('clientsManagement:historyTab'),
        key: 'history',
        children: <Shipments />,
      },
    ],
    [i18n.language]
  )

  return (
    <div>
      <div className={styles.title}>{t('global:allShipments')}</div>
      <div className={styles.content}>
        <SideBar />
        <div className={styles.main}>
          <Tabs
            destroyInactiveTabPane
            defaultActiveKey={params.tab}
            size="small"
            onChange={tabsChange}
            items={tabItems}
            tabBarExtraContent={<SortShipments />}
            className={styles.tabs}
          />
        </div>
      </div>
    </div>
  )
}

export default AllShipments
