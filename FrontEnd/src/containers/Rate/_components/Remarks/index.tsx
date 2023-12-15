import React, { ChangeEvent, useCallback } from 'react'

import { Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { useRateStore } from 'stores/rate'

import styles from './styles.module.scss'

const Remarks: React.FC = () => {
  const { t } = useTranslation(['newRate'])
  const { remarks, setRateValue } = useRateStore(
    ({ rate, setRateValue }) => ({ remarks: rate.remarks, setRateValue }),
    shallow
  )

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setRateValue('remarks', e.target.value)
  }, [])

  return (
    <Input.TextArea
      value={remarks}
      onChange={handleChange}
      className={styles.textArea}
      placeholder={t('newRate:optional')}
      autoSize={{ minRows: 4, maxRows: 12 }}
    />
  )
}

export default Remarks
