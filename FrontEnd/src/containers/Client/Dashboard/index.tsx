import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import SortShipments from 'components/SortShipments'

import MapBlock from './MapBlock'
import SearchBlock from './SearchContainer'
import Shipments from './Shipments'
import SideBar from './SideBar'

import { useShipmentsDashboardStore } from 'stores/shipmentsDashboard'

import styles from './styles.module.scss'

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation(['global', 'clientsManagement'])
  const params = useParams()
  const navigate = useNavigate()

  const setSearchByNumber = useShipmentsDashboardStore(
    store => store.setSearchByNumber
  )

  const [value, setValue] = useState<string>('')

  const handleSearchClick = useCallback(() => setSearchByNumber(value), [value])

  useEffect(() => {
    setSearchByNumber(value)
  }, [])

  const tabsChange = useCallback((key: string) => {
    navigate(`/client/dashboard/${key}`)
  }, [])

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
    <div className="wrapper">
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.title}>{t('global:dashboard')}</div>
          <SearchBlock
            value={value}
            setValue={setValue}
            handleBtnClick={handleSearchClick}
          />
        </div>
        <div className={styles.content}>
          <SideBar />
          <div className={styles.main}>
            <div className={styles.map}>
              <MapBlock />
            </div>
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
    </div>
  )
}

export default Dashboard
