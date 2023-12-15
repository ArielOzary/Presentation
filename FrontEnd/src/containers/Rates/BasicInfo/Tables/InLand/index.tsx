import React from 'react'

import { ExpandOutlined } from '@ant-design/icons'
import { Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import Prices from './Prices'
import Rules from './Rules'
import Zones from './Zones'

import { CalculationOption, RateCharges, WeightFormat } from 'models'

import { weightFormatAbbr } from 'utils/const'

interface Props {
  quotes: RateCharges['inLand']
}

const { Text, Title } = Typography

const InLand: React.FC<Props> = ({ quotes }) => {
  const { t } = useTranslation(['rates'])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={5}>{t('rates:tables.zoneRanges')}</Title>
        <Zones zones={quotes?.zones || []} />
      </Space>

      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={5}>{t('rates:tables.prices')}</Title>
        <Text>
          <ExpandOutlined />
          1CBM = {quotes?.volume}{' '}
          {weightFormatAbbr[quotes?.weightFormat || WeightFormat.KG]}
        </Text>
        <Prices
          prices={quotes?.prices || []}
          zones={quotes?.zones || []}
          unitType={quotes?.unitType || CalculationOption.TotalShipment}
        />
      </Space>

      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={5}>{t('rates:tables.rules')}</Title>
        <Rules rules={quotes?.rules || []} />
      </Space>
    </Space>
  )
}

export default InLand
