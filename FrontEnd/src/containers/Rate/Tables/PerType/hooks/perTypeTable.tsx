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
  PerTypeItem,
  RateChargesType,
} from 'models'
import { perTypeTableSelector, useRateStore } from 'stores/rate'

import { currencyOptions, currencySymbol } from 'utils/const'
import { UniqueCollection } from 'utils/uniqueCollection'

import tableStyles from '../../tables.module.scss'

export const usePerTypeTable = (chargesType: RateChargesType) => {
  const { t, i18n } = useTranslation(['newRate', 'global'])
  const {
    addRateTableRootItem,
    removeRateTableRootItem,
    setRateTableRootItemValue,
  } = useRateStore(state => perTypeTableSelector(chargesType, state), shallow)

  const handleAddItem = useCallback(() => {
    addRateTableRootItem(chargesType, 'perType', {
      key: uniqueId(),
      name: '',
      CTR20FT: 0,
      CTR40FT: 0,
      CTR40HC: 0,
      CTR20OT: 0,
      CTR40OT: 0,
      CTR20RF: 0,
      CTR40RF: 0,
      currency: CurrencyType.USD,
    })
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    return () => removeRateTableRootItem(chargesType, 'perType', index)
  }, [])

  const handleItemChange = useCallback(
    <P extends keyof PerTypeItem>(
      index: number,
      prop: P,
      value: ArrayElement<UniqueCollection<PerTypeItem>>[P]
    ) => {
      setRateTableRootItemValue(chargesType, 'perType', prop, index, value)
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
              placeholder={'THC'}
              value={name}
              onChange={e => handleItemChange(index, 'name', e.target.value)}
            />
          ),
        },
        {
          title: '20FT',
          dataIndex: 'CTR20FT',
          width: 80,
          align: 'center',
          render: (CTR20FT, _row, index) => (
            <InputNumber
              bordered={false}
              prefix={currencySymbol[_row.currency]}
              value={CTR20FT}
              placeholder="0.00"
              controls={false}
              onChange={value => handleItemChange(index, 'CTR20FT', value || 0)}
              rootClassName={tableStyles.tableInput}
            />
          ),
        },
        {
          title: '40FT',
          dataIndex: 'CTR40FT',
          width: 80,
          align: 'center',
          render: (CTR40FT, _row, index) => (
            <InputNumber
              bordered={false}
              prefix={currencySymbol[_row.currency]}
              value={CTR40FT}
              placeholder="0.00"
              controls={false}
              onChange={value => handleItemChange(index, 'CTR40FT', value || 0)}
              rootClassName={tableStyles.tableInput}
            />
          ),
        },
        {
          title: '40HC',
          dataIndex: 'CTR40HC',
          width: 80,
          align: 'center',
          render: (CTR40HC, _row, index) => (
            <InputNumber
              bordered={false}
              prefix={currencySymbol[_row.currency]}
              value={CTR40HC}
              placeholder="0.00"
              controls={false}
              onChange={value => handleItemChange(index, 'CTR40HC', value || 0)}
              rootClassName={tableStyles.tableInput}
            />
          ),
        },
        {
          title: '20OT',
          dataIndex: 'CTR20OT',
          width: 80,
          align: 'center',
          render: (CTR20OT, _row, index) => (
            <InputNumber
              bordered={false}
              prefix={currencySymbol[_row.currency]}
              value={CTR20OT}
              placeholder="0.00"
              controls={false}
              onChange={value => handleItemChange(index, 'CTR20OT', value || 0)}
              rootClassName={tableStyles.tableInput}
            />
          ),
        },
        {
          title: '40OT',
          dataIndex: 'CTR40OT',
          width: 80,
          align: 'center',
          render: (CTR40OT, _row, index) => (
            <InputNumber
              bordered={false}
              prefix={currencySymbol[_row.currency]}
              value={CTR40OT}
              placeholder="0.00"
              controls={false}
              onChange={value => handleItemChange(index, 'CTR40OT', value || 0)}
              rootClassName={tableStyles.tableInput}
            />
          ),
        },
        {
          title: '20RF',
          dataIndex: 'CTR20RF',
          width: 80,
          align: 'center',
          render: (CTR20RF, _row, index) => (
            <InputNumber
              bordered={false}
              prefix={currencySymbol[_row.currency]}
              value={CTR20RF}
              placeholder="0.00"
              controls={false}
              onChange={value => handleItemChange(index, 'CTR20RF', value || 0)}
              rootClassName={tableStyles.tableInput}
            />
          ),
        },
        {
          title: '40RF',
          dataIndex: 'CTR40RF',
          width: 80,
          align: 'center',
          render: (CTR40RF, _row, index) => (
            <InputNumber
              bordered={false}
              prefix={currencySymbol[_row.currency]}
              value={CTR40RF}
              placeholder="0.00"
              controls={false}
              onChange={value => handleItemChange(index, 'CTR40RF', value || 0)}
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
      ] as ColumnsType<PerTypeItem & { key: string }>,
    [i18n.language]
  )

  return { columns, renderFooter }
}
