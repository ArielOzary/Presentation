import React from 'react'

import { Space, Spin } from 'antd'
import { useTranslation } from 'react-i18next'

import AvatarWithInitials from 'components/AvatarWithInitials'
import PhoneNumber from 'components/PhoneNumber'

import { useFreightForwarderClientsStore } from 'stores/freightForwarderClients'

import styles from './styles.module.scss'

const CardFF: React.FC = () => {
  const { t } = useTranslation([
    'global',
    'adminSignUp',
    'signUp',
    'clientsManagement',
  ])
  const client = useFreightForwarderClientsStore(store => store.client)

  return client ? (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          <AvatarWithInitials
            styles={styles.avatar}
            name={client.companyNameEn}
          />
          <Space direction="vertical" size={2}>
            <span className={styles.companyName}>
              {client.companyNameEn || ''}
            </span>
          </Space>
        </div>
      </div>
      <div className={styles.description}>
        <div>
          <span className={styles.title}>
            {t('adminSignUp:personOfContact')}
          </span>
          <p className={styles.info}>{client.contactName || ''}</p>
        </div>
        <div>
          <span className={styles.title}>
            {t('signUp:contactInfo.phoneNumber')}
          </span>
          <PhoneNumber
            number={client.contactPhoneNumber}
            className={styles.info}
          />
        </div>
        <div>
          <span className={styles.title}>{t('global:email')}</span>
          <p className={styles.info}>{client.contactEmail || ''}</p>
        </div>
      </div>
    </div>
  ) : (
    <Spin>
      <div className={styles.wrapper} />
    </Spin>
  )
}

export default CardFF
