import React, { useCallback, useMemo } from 'react'

import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, InputNumber, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { uniqueId } from 'lodash'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { useHelpers } from 'containers/Rate/Tables/helpers'

import {
  ArrayElement,
  CurrencyType,
  OceanFreightFCLOverweightItem,
  RateChargesType,
} from 'models'
import { oceanFreightLCLTableSelector, useRateStore } from 'stores/rate'

import { currencyOptions, currencySymbol } from 'utils/const'
import { UniqueCollection } from 'utils/uniqueCollection'

import tableStyles from '../../../tables.module.scss'

export const useOceanFreightFCLOverweightTable = (
  chargesType: RateChargesType
) => {
  const { t, i18n } = useTranslation(['newRate', 'global'])
  const { parserKG, formatterKG } = useHelpers()

  const { addRateTableItem, removeRateTableItem, setRateTableItemValue } =
    useRateStore(
      state => oceanFreightLCLTableSelector(chargesType, state),
      shallow
    )

  const handleAddItem = useCallback(() => {
    addRateTableItem(chargesType, 'oceanFreightFCL', 'overweight', {
      key: uniqueId(),
      limit: 0,
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
    return () =>
      removeRateTableItem(chargesType, 'oceanFreightFCL', 'overweight', index)
  }, [])

  const handleItemChange = useCallback(
    <P extends keyof OceanFreightFCLOverweightItem>(
      index: number,
      prop: P,
      value: ArrayElement<UniqueCollection<OceanFreightFCLOverweightItem>>[P]
    ) => {
      setRateTableItemValue(
        chargesType,
        'oceanFreightFCL',
        'overweight',
        prop,
        index,
        value
      )
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
          title: t('newRate:table.aboveXkg'),
          dataIndex: 'limit',
          width: 185,
          render: (limit, _row, index) => (
            <InputNumber
              bordered={false}
              prefix="+"
              value={limit}
              placeholder="20 KG"
              formatter={formatterKG}
              parser={parserKG}
              controls={false}
              onChange={value => handleItemChange(index, 'limit', value || 0)}
              rootClassName={tableStyles.tableInput}
            />
          ),
        },
        {
          title: '20FT',
          dataIndex: 'CTR20FT',
          width: 95,
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
          width: 95,
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
          width: 95,
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
          width: 95,
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
          width: 95,
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
          width: 95,
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
          width: 95,
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
          width: 100,
          fixed: 'right',
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
      ] as ColumnsType<OceanFreightFCLOverweightItem & { key: string }>,
    [i18n.language]
  )

  return { columns, renderFooter }
}
