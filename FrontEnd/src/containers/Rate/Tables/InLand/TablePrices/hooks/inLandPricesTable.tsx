import React, { useCallback, useMemo } from 'react'

import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, InputNumber, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { useHelpers } from 'containers/Rate/Tables/helpers'

import {
  CalculationOption,
  CurrencyType,
  InLandPriceItem,
  RateChargesType,
} from 'models'
import { inLandTableSelector, useRateStore } from 'stores/rate'

import { currencySymbol, useOptions } from 'utils/const'

import tableStyles from '../../../tables.module.scss'

export const useInLandPricesTable = (chargesType: RateChargesType) => {
  const { t, i18n } = useTranslation(['newRate', 'global'])
  const { parserKG, formatterKG } = useHelpers()
  const { calculationOptions } = useOptions()
  const {
    inLand,
    addRateInLandPriceItem,
    removeRateInLandPriceItem,
    setRateInLandPriceItemValue,
    setRateInLandPriceItemValues,
    setRateTableValue,
  } = useRateStore(state => inLandTableSelector(chargesType, state), shallow)

  const handleAddItem = useCallback(() => {
    addRateInLandPriceItem(chargesType)
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    return () => removeRateInLandPriceItem(chargesType, index)
  }, [])

  const handleItemChange = useCallback(
    <P extends keyof InLandPriceItem>(
      index: number,
      prop: P,
      value: InLandPriceItem[P]
    ) => {
      setRateInLandPriceItemValue(chargesType, index, prop, value)
    },
    []
  )

  const handlePriceItemValuesChange = useCallback(
    (priceIndex: number, valueIndex: number, value: number) => {
      setRateInLandPriceItemValues(chargesType, priceIndex, valueIndex, value)
    },
    []
  )

  const handleUnitTypeChange = useCallback((unitType: CalculationOption) => {
    setRateTableValue(chargesType, 'inLand', 'unitType', unitType)
  }, [])

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

  const renderUnitTypeTitle = useCallback(() => {
    return (
      <Select
        className={cn(tableStyles.headerSelect, tableStyles.block)}
        options={calculationOptions}
        value={inLand?.unitType}
        onChange={handleUnitTypeChange}
      />
    )
  }, [i18n.language, inLand?.unitType])

  const getPriceColumns = useCallback(() => {
    if (!inLand) {
      return []
    }

    const count = inLand ? inLand.zones.length : 0

    const columns = []
    for (let i = 0; i < count; i++) {
      columns.push({
        title: () => `Zone ${i + 1}`,
        dataIndex: 'key',
        width: 250,
        render: (_key: string, _row: InLandPriceItem, index: number) => {
          const value = inLand.prices[index].values[i]

          return (
            <InputNumber
              bordered={false}
              prefix={currencySymbol[CurrencyType.USD]}
              value={value}
              placeholder="0.00"
              controls={false}
              onChange={value =>
                handlePriceItemValuesChange(index, i, value || 0)
              }
              rootClassName={tableStyles.tableInput}
            />
          )
        },
      })
    }

    return columns
  }, [i18n.language, inLand?.zones, inLand?.prices])

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
                disabled={index === 0}
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
          title: renderUnitTypeTitle,
          dataIndex: 'limit',
          fixed: 'left',
          width: 150,
          render: (limit, _row, index) =>
            index === 0 ? (
              'Minimum'
            ) : (
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
        ...getPriceColumns(),
      ] as ColumnsType<InLandPriceItem & { key: string }>,
    [i18n.language, getPriceColumns]
  )

  return { columns, renderFooter }
}
