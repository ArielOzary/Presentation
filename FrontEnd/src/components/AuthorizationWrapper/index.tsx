import React from 'react'

import { Button, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import LocaleSelector from 'components/LocaleSelector'

import styles from './styles.module.scss'

import { ReactComponent as LogoIcon } from 'assets/logo.svg'

export enum WrapperType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
}

interface Props {
  children?: React.ReactNode
  sidebar?: React.ReactNode
  type?: WrapperType
}

const AuthorizationWrapper: React.FC<Props> = ({
  children,
  sidebar,
  type = WrapperType.SIGN_IN,
}) => {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <LogoIcon className={styles.logo} />
      <Space className={styles.button}>
        <LocaleSelector />
        <Link to={type === WrapperType.SIGN_IN ? '/sign-up' : '/sign-in'}>
          <Button type="primary" size="large" className="bold">
            {type === WrapperType.SIGN_IN ? t('signUp') : t('signIn')}
          </Button>
        </Link>
      </Space>
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}

export default AuthorizationWrapper
