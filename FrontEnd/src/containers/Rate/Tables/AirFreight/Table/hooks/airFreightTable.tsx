import React, { useCallback, useEffect, useMemo } from 'react'

import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, InputNumber, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { useHelpers } from 'containers/Rate/Tables/helpers'
import usePortOptions from 'containers/Rate/Tables/utils/usePortOptions'

import {
  AirFreightItem,
  AirFreightPriceItem,
  CurrencyType,
  RateChargesType,
  WeightFormat,
} from 'models'
import { useFreightForwarderClientsStore } from 'stores/freightForwarderClients'
import { airFreightTableSelector, useRateStore } from 'stores/rate'

import {
  currencyOptions,
  currencySymbol,
  weightFormatAbbr,
  weightFormatOptions,
} from 'utils/const'

import tableStyles from '../../../tables.module.scss'

export const useAirFreightTable = (chargesType: RateChargesType) => {
  const { t, i18n } = useTranslation(['newRate', 'global'])
  const { parserDays, formatterDays } = useHelpers()

  const {
    airFreight,
    addRateAirFreightItem,
    removeRateAirFreightItem,
    setRateAirFreightItemValue,
    addRateAirFreightPriceItem,
    removeRateAirFreightPriceItem,
    setRateAirFreightPriceItemValue,
    setRateAirFreightPriceItemValues,
  } = useRateStore(
    state => airFreightTableSelector(chargesType, state),
    shallow
  )
  const customQuote = useFreightForwarderClientsStore(
    store => store.customQuote
  )

  const { options, isLoading } = usePortOptions(0)

  const handleAddItem = useCallback(() => {
    addRateAirFreightItem(chargesType)
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    return () => removeRateAirFreightItem(chargesType, index)
  }, [])

  const handleAddPriceItem = useCallback(() => {
    addRateAirFreightPriceItem(chargesType)
  }, [])

  const handleRemovePriceItem = useCallback((index: number) => {
    return () => removeRateAirFreightPriceItem(chargesType, index)
  }, [])

  const handleItemChange = useCallback(
    <P extends keyof AirFreightItem>(
      index: number,
      prop: P,
      value: AirFreightItem[P]
    ) => {
      setRateAirFreightItemValue(chargesType, index, prop, value)
    },
    []
  )

  const handlePriceItemChange = useCallback(
    <P extends keyof AirFreightPriceItem>(
      index: number,
      prop: P,
      value: AirFreightPriceItem[P]
    ) => {
      setRateAirFreightPriceItemValue(chargesType, index, prop, value)
    },
    []
  )

  const handlePriceItemValuesChange = useCallback(
    (priceIndex: number, valueIndex: number, value: number) => {
      setRateAirFreightPriceItemValues(
        chargesType,
        priceIndex,
        valueIndex,
        value
      )
    },
    []
  )
  const onChangeSelect = useCallback(
    (id: number, type: string, index: number) => {
      const selectPort = options.find(port => port.value === id)
      if (selectPort?.label && selectPort?.country && type === 'POD') {
        handleItemChange(index, 'POD', selectPort?.label)
        handleItemChange(index, 'PODCountry', selectPort?.country)
      }
      if (selectPort?.label && selectPort?.country && type === 'POL') {
        handleItemChange(index, 'POL', selectPort?.label)
        handleItemChange(index, 'POLCountry', selectPort?.country)
      }
    },
    [options]
  )

  useEffect(() => {
    addRateAirFreightItem(chargesType)
    customQuote?.destination?.portName &&
      handleItemChange(0, 'POD', customQuote?.destination?.portName)
    customQuote?.destination?.country &&
      handleItemChange(0, 'PODCountry', customQuote?.destination?.country)
    customQuote?.origin?.portName &&
      handleItemChange(0, 'POL', customQuote?.origin?.portName)
    customQuote?.origin?.country &&
      handleItemChange(0, 'POLCountry', customQuote?.origin?.country)
  }, [customQuote])

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

  const renderExtraPriceTitle = useCallback(
    (index: number, item: AirFreightPriceItem) => {
      return (
        <div className={tableStyles.tableHeaderSpaces}>
          <InputNumber
            className={tableStyles.input}
            controls={false}
            placeholder={`X ${
              weightFormatAbbr[item.weightFormat || WeightFormat.KG]
            }`}
            value={item.limit}
            onChange={value =>
              handlePriceItemChange(index, 'limit', value || 0)
            }
          />
          <Select
            className={tableStyles.select}
            options={weightFormatOptions}
            value={item.weightFormat}
            onChange={value =>
              handlePriceItemChange(index, 'weightFormat', value)
            }
          />
          <Button
            onClick={handleRemovePriceItem(index)}
            size="small"
            icon={<CloseOutlined />}
            type="text"
          />
        </div>
      )
    },
    [i18n.language]
  )

  const getPriceColumns = useCallback(() => {
    if (!airFreight) {
      return []
    }

    const count = airFreight ? airFreight.prices.length : 0

    const columns = []
    for (let i = 0; i < count; i++) {
      columns.push({
        title: () =>
          i === 0
            ? t('newRate:table.minimum')
            : renderExtraPriceTitle(i, airFreight.prices[i]),
        dataIndex: 'key',
        width: i === 0 ? 95 : 170,
        render: (_key: string, _row: AirFreightItem, index: number) => {
          const value = airFreight.prices[i].values[index]

          return (
            <InputNumber
              bordered={false}
              prefix={currencySymbol[_row.currency || CurrencyType.USD]}
              value={value}
              placeholder="0.00"
              controls={false}
              onChange={value =>
                handlePriceItemValuesChange(i, index, value || 0)
              }
              rootClassName={tableStyles.tableInput}
            />
          )
        },
      })
    }

    return columns
  }, [i18n.language, airFreight?.items, airFreight?.prices])

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
          title: t('newRate:table.POL'),
          dataIndex: 'POL',
          width: 200,
          render: (POL, _row, index) => (
            <Select
              style={{ width: 200 }}
              placeholder="POL"
              showSearch
              value={POL || null}
              options={options}
              bordered={false}
              onChange={e => onChangeSelect(e, 'POL', index)}
              loading={isLoading}
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          ),
        },
        {
          title: t('newRate:table.POD'),
          dataIndex: 'POD',
          width: 200,
          render: (POD, _row, index) => (
            <Select
              style={{ width: 200 }}
              placeholder="POD"
              showSearch
              value={POD || null}
              options={options}
              bordered={false}
              loading={isLoading}
              onChange={e => onChangeSelect(e, 'POD', index)}
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          ),
        },
        ...getPriceColumns(),
        {
          title: () => (
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddPriceItem}
              disabled={!airFreight || airFreight.items.length < 1}
            />
          ),
          align: 'center',
          dataIndex: 'key',
          width: 50,
          render: () => '',
        },
        {
          title: t('newRate:table.currency'),
          dataIndex: 'currency',
          width: 100,
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
        {
          title: t('newRate:table.transitionTime'),
          dataIndex: 'transitionTime',
          width: 110,
          render: (transitionTime, _row, index) => (
            <InputNumber
              bordered={false}
              value={transitionTime}
              placeholder="X Days"
              controls={false}
              onChange={(value: number | null) =>
                handleItemChange(index, 'transitionTime', value || 0)
              }
              rootClassName={tableStyles.tableInput}
              formatter={formatterDays}
              parser={parserDays}
            />
          ),
        },
      ] as ColumnsType<AirFreightItem & { key: string }>,
    [i18n.language, getPriceColumns, options]
  )

  return { columns, renderFooter }
}
