import React from 'react'

import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

// import useConfig from '../../config'
// import { useGetAvailableList } from 'fetchers'
// import { AvailableQuotesListDto } from 'models'
// import { useSearchQuoteStore } from 'stores/searchQuote'
import styles from './styles.module.scss'

interface Props {
  isValidating: boolean
  isLoad: boolean
  children?: React.ReactNode
}

const ConfirmBtn: React.FC<Props> = ({
  isValidating,
  children,
  isLoad = false,
}) => {
  const { t } = useTranslation(['global'])

  return (
    <div className={styles.container}>
      {isLoad && children}
      <Button
        htmlType="submit"
        type="primary"
        loading={isValidating}
        className={styles.btn}
      >
        {t('global:confirm')}
      </Button>
    </div>
  )
}

export default ConfirmBtn
