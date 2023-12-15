import React, { useMemo } from 'react'

import { Space, Spin } from 'antd'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import AvatarWithInitials from 'components/AvatarWithInitials'
import ChangeUserStatus from 'components/ChangeUserStatus'
import PhoneNumber from 'components/PhoneNumber'

import Status from '../../../../components/Clients/List/Item/Status'

import { useGetClientProfile, useGetUserById } from 'fetchers'
import { UserVerificationStatus } from 'models'

import { usdFormatter } from 'utils/formatters'

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

  const { data: profile, isLoading: isProfileLoading } = useGetClientProfile(
    { id: params.id || '' },
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
            styles={cn(
              styles.avatar,
              user.status === UserVerificationStatus.Pending && styles.pending,
              user.status === UserVerificationStatus.Rejected && styles.rejected
            )}
            name={profile?.companyProfile?.nameEn}
          />

          <Space direction="vertical" size={2}>
            <span className={styles.companyName}>
              {profile?.companyProfile?.nameEn || ''}
            </span>

            {user.status !== UserVerificationStatus.Verified && (
              <Status status={user?.status} />
            )}
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
          <p className={styles.info}>{profile?.companyContact?.name || ''}</p>
        </div>
        <div>
          <span className={styles.title}>
            {t('signUp:contactInfo.phoneNumber')}
          </span>
          <PhoneNumber
            number={profile?.companyContact?.phoneNumber}
            className={styles.info}
          />
        </div>
        <div>
          <span className={styles.title}>{t('global:email')}</span>
          <p className={styles.info}>{profile?.companyContact?.email || ''}</p>
        </div>
        <div>
          <span className={styles.title}>
            {t('clientsManagement:profitMargin')}
          </span>
          <p className={styles.info}>
            {usdFormatter.format(profile.totalProfit ? profile.totalProfit : 0)}
          </p>
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
