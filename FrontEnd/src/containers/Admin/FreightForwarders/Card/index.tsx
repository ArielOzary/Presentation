import React, { useEffect, useMemo, useState } from 'react'

import { Space, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import AvatarWithInitials from 'components/AvatarWithInitials'
import ChangeUserStatus from 'components/ChangeUserStatus'
import PhoneNumber from 'components/PhoneNumber'

import {
  useGetFreightForwarderProfileBasicInfo,
  useGetFreightForwarderProfileContacts,
  useGetUserById,
} from 'fetchers'
import { CompanyContactProfileDto, CompanyContactType } from 'models'

import styles from './styles.module.scss'

interface Props {
  refetchList: () => void
}

const Card: React.FC<Props> = ({ refetchList }) => {
  const { t } = useTranslation(['global', 'signUp', 'adminSignUp'])
  const params = useParams()

  const [paymentContact, setPaymentContact] =
    useState<CompanyContactProfileDto | null>(null)

  const { data: contacts, isLoading: isContactsLoading } =
    useGetFreightForwarderProfileContacts(params.id || '', {
      enabled: Boolean(params.id),
    })
  const { data: basicInfo, isLoading: isBasicInfoLoading } =
    useGetFreightForwarderProfileBasicInfo(params.id || '', {
      enabled: Boolean(params.id),
    })
  const {
    data: user,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useGetUserById(params.id || '', {
    enabled: Boolean(params.id),
  })

  useEffect(() => {
    if (contacts?.companyContacts && contacts.companyContacts.length > 0) {
      const basicContact = contacts.companyContacts.find(
        contact => contact.contactType === CompanyContactType.Payment
      )

      setPaymentContact(basicContact || null)
    }
  }, [contacts])

  const isLoading = useMemo(
    () => isUserLoading || isBasicInfoLoading || isContactsLoading,
    [isUserLoading, isBasicInfoLoading, isContactsLoading]
  )

  return basicInfo && contacts && user ? (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          <AvatarWithInitials
            styles={styles.avatar}
            name={basicInfo.companyProfile?.nameEn}
          />
          <Space direction="vertical" size={2}>
            <span className={styles.companyName}>
              {basicInfo.companyProfile?.nameEn}
            </span>
          </Space>
        </div>
        <ChangeUserStatus
          user={user}
          onSuccess={refetchUser}
          refetchList={refetchList}
        />
      </div>
      <div className={styles.description}>
        <div>
          <span className={styles.title}>
            {t('adminSignUp:personOfContact')}
          </span>
          <p className={styles.info}>{paymentContact?.name || ''}</p>
        </div>
        {/* <div>
          <span className={styles.title}>{t('adminSignUp:fax')}</span>
          <p className={styles.info}>{forwarderInfo?.basic.fax}</p>
        </div> */}
        <div>
          <span className={styles.title}>
            {t('signUp:contactInfo.phoneNumber')}
          </span>
          <PhoneNumber
            number={paymentContact?.phoneNumber}
            className={styles.info}
          />
        </div>
        <div>
          <span className={styles.title}>{t('global:email')}</span>
          <p className={styles.info}>{paymentContact?.email || ''}</p>
        </div>
      </div>
    </div>
  ) : (
    <Spin spinning={isLoading}>
      <div className={styles.wrapper} />
    </Spin>
  )
}

export default Card
