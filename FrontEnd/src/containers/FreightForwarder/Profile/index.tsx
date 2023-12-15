import React, { useCallback, useEffect, useMemo, useState } from 'react'

import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import AvatarWithInitials from 'components/AvatarWithInitials'

import BasicInfo from './BasicInfo'
import CompanyLocation from './CompanyLocation'
import ContactInfo from './ContactInfo'

import { useGetOwnBasicInfo, useGetOwnContacts } from 'fetchers'
import { CompanyContactProfileDto, CompanyContactType } from 'models'

import styles from './styles.module.scss'

const Profile: React.FC = () => {
  const { t, i18n } = useTranslation(['global', 'freightForwardersManagement'])

  const [activeTab, setActiveTab] = useState<string>('basicInfo')
  const [paymentContact, setPaymentContact] = useState<
    CompanyContactProfileDto | undefined
  >(undefined)

  const { data, refetch, isLoading } = useGetOwnBasicInfo()
  const {
    data: contactInfo,
    isLoading: contactsLoading,
    refetch: refetchContacts,
  } = useGetOwnContacts()

  const handleClick = useCallback((key: string) => {
    return () => setActiveTab(key)
  }, [])

  const tabItems = useMemo(
    () => [
      {
        label: t('freightForwardersManagement:basicInfoTab'),
        key: 'basicInfo',
      },
      {
        label: t('freightForwardersManagement:contactInfoTab'),
        key: 'contactInfo',
      },
      {
        label: t('freightForwardersManagement:companyLocationTab'),
        key: 'companyLocation',
      },
    ],
    [i18n.language]
  )

  useEffect(() => {
    if (contactInfo) {
      const { companyContacts = [] } = contactInfo
      setPaymentContact(
        companyContacts?.find(
          contact => contact.contactType === CompanyContactType.Payment
        )
      )
    }
  }, [contactInfo])

  const dataTabs = useCallback(() => {
    switch (activeTab) {
      case 'companyLocation':
        return <CompanyLocation />
      case 'contactInfo':
        return (
          <ContactInfo
            data={contactInfo}
            refetch={refetchContacts}
            isLoading={contactsLoading}
          />
        )
      default:
        return <BasicInfo data={data} refetch={refetch} isLoading={isLoading} />
    }
  }, [activeTab, data, contactInfo])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.content}>
          <AvatarWithInitials
            styles={styles.avatar}
            name={paymentContact?.name}
          />
          <p className={styles.name}>{paymentContact?.name}</p>
          <p className={styles.companyName}>{data?.companyProfile?.nameEn}</p>
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
  )
}

export default Profile
