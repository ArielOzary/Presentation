import React, { useCallback, useEffect, useMemo, useState } from 'react'

import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import AvatarWithInitials from 'components/AvatarWithInitials'

import CompanyInfo from './CompanyInfo'
import CompanyLocation from './CompanyLocation'
import PersonalInfo from './PersonalInfo'
import SupplierInfo from './SupplierInfo'

import { useGetOwnProfile } from 'fetchers/clients/getOwnProfile'
import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

const Profile = () => {
  const { t, i18n } = useTranslation([
    'global',
    'freightForwardersManagement',
    'clientProfile',
    'signUp',
  ])

  const [activeTab, setActiveTab] = useState<string>('companyInfo')

  const setClientProfile = useProfileStore(store => store.setClientProfile)

  const { data, isLoading, refetch } = useGetOwnProfile()

  const handleClick = useCallback((key: string) => {
    return () => setActiveTab(key)
  }, [])

  const tabItems = useMemo(
    () => [
      {
        label: t('signUp:companyInfo.title'),
        key: 'companyInfo',
      },
      {
        label: t('clientProfile:personalInfo'),
        key: 'personalInfo',
      },
      {
        label: t('freightForwardersManagement:companyLocationTab'),
        key: 'companyLocation',
      },
      {
        label: t('clientProfile:supplierInfo'),
        key: 'supplierInfo',
      },
    ],
    [i18n.language]
  )
  const dataTabs = useCallback(() => {
    switch (activeTab) {
      case 'personalInfo':
        return <PersonalInfo isLoading={isLoading} refetch={refetch} />
      case 'companyLocation':
        return <CompanyLocation isLoading={isLoading} refetch={refetch} />
      case 'supplierInfo':
        return <SupplierInfo />
      default:
        return <CompanyInfo isLoading={isLoading} refetch={refetch} />
    }
  }, [activeTab, data, data])

  useEffect(() => data && setClientProfile(data), [data])

  return (
    <div className="wrapper">
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.content}>
            <AvatarWithInitials
              styles={styles.avatar}
              name={data?.companyProfile?.nameEn}
            />
            <p className={styles.name}>{data?.companyProfile?.nameEn}</p>
            <p className={styles.companyName}>
              {data?.companyContacts?.[0].name}
            </p>
            <div className={styles.tabs}>
              {tabItems.map(tab => (
                <button
                  key={tab.key}
                  onClick={handleClick(tab.key)}
                  className={cn(
                    styles.tab,
                    activeTab === tab.key && styles.active
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.main}>{dataTabs()}</div>
      </div>
    </div>
  )
}

export default Profile
