import React, { useMemo } from 'react'

import { InputNumber, Select, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { WeightFormat } from 'models'

import { weightFormatOptions } from 'utils/const'

import styles from './styles.module.scss'

interface Props {
  volume: number | null
  weightFormat: WeightFormat
  onVolumeChange: (volume: number | null) => void
  onWeightFormatChange: (volume: number) => void
  disabledWeightFormat?: boolean
}

const WeightInput: React.FC<Props> = ({
  volume,
  weightFormat,
  onVolumeChange,
  onWeightFormatChange,
  disabledWeightFormat = false,
}) => {
  const { t } = useTranslation(['global', 'rates'])

  const addonAfter = useMemo(
    () => (
      <Select
        options={weightFormatOptions}
        value={weightFormat}
        onChange={onWeightFormatChange}
        disabled={disabledWeightFormat}
      />
    ),
    [weightFormat, disabledWeightFormat]
  )

  return (
    <Space className={styles.container}>
      <Typography.Text>1CBM:</Typography.Text>
      <InputNumber
        placeholder={t('global:weight')}
        controls={false}
        className={styles.input}
        addonAfter={addonAfter}
        value={volume}
        onChange={onVolumeChange}
        min={1}
        status={!volume ? 'error' : ''}
      />
      {!volume && <p className={styles.errorText}>{t('rates:minValue')}</p>}
    </Space>
  )
}

export default WeightInput
