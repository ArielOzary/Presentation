import React from 'react'

import { Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import Items from './Items'
import Overweight from './Overweight'

import { RateCharges } from 'models'

interface Props {
  quotes: RateCharges['oceanFreightFCL']
}

const OceanFCL: React.FC<Props> = ({ quotes }) => {
  const { t } = useTranslation(['rates'])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Items items={quotes?.items || []} />

      <Space direction="vertical" style={{ width: '100%' }}>
        <Typography.Title level={5}>
          {t('rates:tables.overweight')}
        </Typography.Title>
        <Overweight overweight={quotes?.overweight || []} />
      </Space>
    </Space>
  )
}

export default OceanFCL
