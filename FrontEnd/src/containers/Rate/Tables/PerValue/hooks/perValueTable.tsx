import React, { useCallback, useMemo } from 'react'

import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, InputNumber, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { uniqueId } from 'lodash'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { useHelpers } from '../../helpers'

import {
  ArrayElement,
  CurrencyType,
  PerValueItem,
  PerValueShipmentType,
  RateChargesType,
  ShipmentOption,
} from 'models'
import { perValueTableSelector, useRateStore } from 'stores/rate'

import { currencyOptions, useOptions } from 'utils/const'
import { UniqueCollection } from 'utils/uniqueCollection'

import tableStyles from '../../tables.module.scss'

export const usePerValueTable = (chargesType: RateChargesType) => {
  const { t, i18n } = useTranslation(['newRate', 'global'])
  const { parserPercent, formatterPercent } = useHelpers()
  const { perValueShipmentTypeOptions } = useOptions()

  const {
    shippingType,
    addRateTableRootItem,
    removeRateTableRootItem,
    setRateTableRootItemValue,
  } = useRateStore(state => perValueTableSelector(chargesType, state), shallow)

  const handleAddItem = useCallback(() => {
    addRateTableRootItem(chargesType, 'perValue', {
      key: uniqueId(),
      name: '',
      percent: 0,
      currency: CurrencyType.USD,
      shipmentType:
        shippingType?.shipmentOption === ShipmentOption.Air
          ? PerValueShipmentType.AirFreight
          : PerValueShipmentType.OceanFreight,
    })
  }, [shippingType])

  const handleRemoveItem = useCallback((index: number) => {
    return () => removeRateTableRootItem(chargesType, 'perValue', index)
  }, [])

  const handleItemChange = useCallback(
    <P extends keyof PerValueItem>(
      index: number,
      prop: P,
      value: ArrayElement<UniqueCollection<PerValueItem>>[P]
    ) => {
      setRateTableRootItemValue(chargesType, 'perValue', prop, index, value)
    },
    []
  )

  const renderFooter = useCallback(
    () => (
      <Button
        icon={<PlusOutlined />}
        type="text"
        className={tableStyles.addItemBtn}
        onClick={handleAddItem}
      >
        {t('newRate:table.addItem')}
      </Button>
    ),
    [i18n.language]
  )

  const columns = useMemo(
    () =>
      [
        {
          dataIndex: 'key',
          fixed: 'left',
          align: 'center',
          width: 40,
          render: (_key, _row, index) => {
            return (
              <Button
                size="small"
                onClick={handleRemoveItem(index)}
                icon={<CloseOutlined />}
                type="text"
                className={tableStyles.deleteItemBtn}
              />
            )
          },
        },
        {
          dataIndex: 'key',
          fixed: 'left',
          align: 'center',
          width: 50,
          title: '#',
          render: (_key, _row, index: number) => {
            return index + 1
          },
        },
        {
          title: t('newRate:table.name'),
          dataIndex: 'name',
          render: (name, _row, index) => (
            <Input
              bordered={false}
              className={tableStyles.tableInput}
              placeholder={'Collection Fee'}
              value={name}
              onChange={e => handleItemChange(index, 'name', e.target.value)}
            />
          ),
        },
        {
          title: t('newRate:table.outOf'),
          dataIndex: 'percent',
          width: 155,
          render: (percent, _row, index) => (
            <InputNumber
              bordered={false}
              value={percent}
              placeholder="0%"
              formatter={formatterPercent}
              parser={parserPercent}
              controls={false}
              onChange={value => handleItemChange(index, 'percent', value || 0)}
              rootClassName={tableStyles.tableInput}
            />
          ),
        },
        {
          title: t('newRate:table.outOf'),
          dataIndex: 'shipmentType',
          width: 175,
          render: (shipmentType, _row, index) => (
            <Select
              value={shipmentType}
              onChange={value => handleItemChange(index, 'shipmentType', value)}
              options={perValueShipmentTypeOptions}
              className={tableStyles.tableInput}
              bordered={false}
            />
          ),
        },
        {
          title: t('newRate:table.currency'),
          dataIndex: 'currency',
          width: 130,
          render: (currency, _row, index) => (
            <Select
              value={currency}
              onChange={value => handleItemChange(index, 'currency', value)}
              options={currencyOptions}
              className={tableStyles.tableInput}
              bordered={false}
            />
          ),
        },
      ] as ColumnsType<PerValueItem & { key: string }>,
    [i18n.language]
  )

  return { columns, renderFooter }
}
