import React, { useCallback, useMemo } from 'react'

import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, InputNumber, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { uniqueId } from 'lodash'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import {
  ArrayElement,
  CurrencyType,
  PerWeightItem,
  RateChargesType,
  WeightFormat,
} from 'models'
import { perWeightTableSelector, useRateStore } from 'stores/rate'

import {
  currencyOptions,
  currencySymbol,
  weightFormatOptions,
} from 'utils/const'
import { UniqueCollection } from 'utils/uniqueCollection'

import tableStyles from '../../tables.module.scss'

export const usePerWeightTable = (chargesType: RateChargesType) => {
  const { t, i18n } = useTranslation(['newRate', 'global'])
  const {
    addRateTableRootItem,
    removeRateTableRootItem,
    setRateTableRootItemValue,
  } = useRateStore(state => perWeightTableSelector(chargesType, state), shallow)

  const handleAddItem = useCallback(() => {
    addRateTableRootItem(chargesType, 'perWeight', {
      key: uniqueId(),
      name: '',
      price: 0,
      weightFormat: WeightFormat.KG,
      volume: 0,
      currency: CurrencyType.USD,
    })
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    return () => removeRateTableRootItem(chargesType, 'perWeight', index)
  }, [])

  const handleItemChange = useCallback(
    <P extends keyof PerWeightItem>(
      index: number,
      prop: P,
      value: ArrayElement<UniqueCollection<PerWeightItem>>[P]
    ) => {
      setRateTableRootItemValue(chargesType, 'perWeight', prop, index, value)
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
              placeholder={'Fuel Surcharge'}
              value={name}
              onChange={e => handleItemChange(index, 'name', e.target.value)}
            />
          ),
        },
        {
          title: t('newRate:table.price'),
          dataIndex: 'price',
          width: 177,
          render: (price, _row, index) => (
            <InputNumber
              bordered={false}
              prefix={currencySymbol[_row.currency]}
              value={price}
              placeholder="0.00"
              controls={false}
              onChange={value => handleItemChange(index, 'price', value || 0)}
              rootClassName={tableStyles.tableInput}
            />
          ),
        },
        {
          title: t('newRate:table.per'),
          dataIndex: 'weightFormat',
          width: 111,
          render: (weightFormat, _row, index) => (
            <Select
              value={weightFormat}
              onChange={value => handleItemChange(index, 'weightFormat', value)}
              options={weightFormatOptions}
              className={tableStyles.tableInput}
              bordered={false}
            />
          ),
        },
        {
          title: 'CBM = Xkg',
          dataIndex: 'volume',
          width: 185,
          render: (volume, _row, index) => (
            <InputNumber
              bordered={false}
              value={volume}
              placeholder="0"
              controls={false}
              onChange={value => handleItemChange(index, 'volume', value || 0)}
              rootClassName={tableStyles.tableInput}
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
      ] as ColumnsType<PerWeightItem & { key: string }>,
    [i18n.language]
  )

  return { columns, renderFooter }
}
