import React from 'react'

import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

interface Props {
  nextStep: () => void
}
const ConfirmButton: React.FC<Props> = ({ nextStep }) => {
  const { t } = useTranslation(['newRate'])
  
  return (
    <Button
      className={styles.button}
      onClick={nextStep}
      size="large"
      type="primary"
    >
      {t('newRate:confirm')}
    </Button>
  )
}

export default ConfirmButton
