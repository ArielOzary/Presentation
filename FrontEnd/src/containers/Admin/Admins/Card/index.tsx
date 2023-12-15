import React, { useMemo } from 'react'

import { Space, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import AvatarWithInitials from 'components/AvatarWithInitials'
import ChangeUserStatus from 'components/ChangeUserStatus'
import PhoneNumber from 'components/PhoneNumber'

import { useGetAdminById, useGetUserById } from 'fetchers'

import styles from './styles.module.scss'

interface Props {
  refetchList: () => void
}

const Card: React.FC<Props> = ({ refetchList }) => {
  const { t } = useTranslation([
    'global',
    'adminSignUp',
    'signUp',
    'clientsManagement',
  ])
  const params = useParams()

  const { data: profile, isLoading: isProfileLoading } = useGetAdminById(
    params.id || '',
    { enabled: Boolean(params.id) }
  )
  const {
    data: user,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useGetUserById(params.id || '', {
    enabled: Boolean(params.id),
  })

  const isLoading = useMemo(
    () => isUserLoading || isProfileLoading,
    [isUserLoading, isProfileLoading]
  )

  return profile && user ? (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          <AvatarWithInitials
            styles={styles.avatar}
            name={profile.companyNameEn}
          />
          <Space direction="vertical" size={2}>
            <span className={styles.companyName}>{profile.companyNameEn}</span>
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
          <p className={styles.info}>{profile.contactName}</p>
        </div>
        <div>
          <span className={styles.title}>
            {t('signUp:contactInfo.phoneNumber')}
          </span>
          <PhoneNumber
            number={profile.contactPhoneNumber}
            className={styles.info}
          />
        </div>
        <div>
          <span className={styles.title}>{t('global:email')}</span>
          <p className={styles.info}>{profile.contactEmail}</p>
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
