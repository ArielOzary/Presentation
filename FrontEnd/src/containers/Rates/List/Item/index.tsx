import React, { forwardRef, useCallback, useMemo } from 'react'

import { CalendarOutlined, CompassOutlined } from '@ant-design/icons'
import { List, Space, Tag, Typography } from 'antd'
import cn from 'classnames'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import useRateShipmentOptions from 'containers/Rate/GeneralInfo/ShipmentTypes/hooks/rateShipmentOptions'

import { RateDto } from 'models'

import { dateFormat } from 'utils/formatters'

import styles from './styles.module.scss'

const { Text } = Typography
interface Props {
  item: RateDto
  ref?: React.ForwardedRef<HTMLElement | null>
}
const Item: React.FC<Props> = forwardRef(({ item }, ref) => {
  const { t, i18n } = useTranslation(['rates'])
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { incoterms, options, types } = useRateShipmentOptions()

  const handleClick = useCallback(() => {
    navigate(`/rates/${item.id}`)
  }, [])

  const isActive = useMemo(() => Number(id ?? 0) === item.id, [id])

  const shippingTypeValue = useMemo(() => {
    if (item.shippingType) {
      const { shippingType } = item

      const incoterm = incoterms.find(
        el => el.type === shippingType?.shipmentIncoterms
      )?.value
      const option = options.find(
        option => option.type === shippingType?.shipmentOption
      )?.value
      const type = types.find(
        el => el.type === shippingType?.shipmentType
      )?.value

      return `${incoterm} | ${option} | ${type}`
    }
    return '-'
  }, [item.shippingType, i18n.language])

  const expirationValue = useMemo(
    () =>
      item.startDate && item.endDate
        ? `${dayjs(item.startDate).format(dateFormat)} - ${dayjs(
            item.endDate
          ).format(dateFormat)}`
        : '-',
    [item.startDate, item.endDate]
  )

  return (
    <List.Item
      ref={ref && ref}
      key={item.id}
      onClick={handleClick}
      className={cn(styles.card, isActive && styles.active)}
    >
      <Text className={styles.rateName}>{item.name}</Text>
      <Space size="middle">
        {item.isDraft && (
          <Tag color="purple" className={styles.draftTag}>
            {t('rates:draft')}
          </Tag>
        )}
        <Text type="secondary">
          <CompassOutlined /> {shippingTypeValue}
        </Text>
        <Text type="secondary">
          <CalendarOutlined /> {expirationValue}
        </Text>
      </Space>
    </List.Item>
  )
})

export default Item
