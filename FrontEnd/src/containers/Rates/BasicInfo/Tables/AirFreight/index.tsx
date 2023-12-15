import React from 'react'

import { ExpandOutlined } from '@ant-design/icons'
import { Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import Rules from '../InLand/Rules'
import Items from './Items'

import { RateCharges, WeightFormat } from 'models'

import { weightFormatAbbr } from 'utils/const'

interface Props {
  quotes: RateCharges['airFreight']
}

const { Title, Text } = Typography

const AirFreight: React.FC<Props> = ({ quotes }) => {
  const { t } = useTranslation(['rates'])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Text>
        <ExpandOutlined /> 1CBM = {quotes?.volume}{' '}
        {weightFormatAbbr[quotes?.weightFormat || WeightFormat.KG]}
      </Text>
      <Items items={quotes?.items || []} prices={quotes?.prices || []} />

      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={5}>{t('rates:tables.rules')}</Title>
        <Rules rules={quotes?.rules || []} />
      </Space>
    </Space>
  )
}

export default AirFreight
