import React, { useCallback, useEffect, useMemo } from 'react'

import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, InputNumber, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { uniqueId } from 'lodash'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { useHelpers } from '../../helpers'
import usePortOptions from '../../utils/usePortOptions'

import {
  ArrayElement,
  CurrencyType,
  OceanFreightLCLItem,
  RateChargesType,
} from 'models'
import { useFreightForwarderClientsStore } from 'stores/freightForwarderClients'
import { oceanFreightLCLTableSelector, useRateStore } from 'stores/rate'

import { currencyOptions, currencySymbol } from 'utils/const'
import { UniqueCollection } from 'utils/uniqueCollection'

import tableStyles from '../../tables.module.scss'

export const useOceanFreightLCLTable = (chargesType: RateChargesType) => {
  const { t, i18n } = useTranslation(['newRate', 'global'])
  const { parserDays, formatterDays } = useHelpers()
  const { options, isLoading } = usePortOptions(1)
  const { addRateTableItem, removeRateTableItem, setRateTableItemValue } =
    useRateStore(
      state => oceanFreightLCLTableSelector(chargesType, state),
      shallow
    )
  const customQuote = useFreightForwarderClientsStore(
    store => store.customQuote
  )

  const handleAddItem = useCallback(() => {
    addRateTableItem(chargesType, 'oceanFreightLCL', 'items', {
      key: uniqueId(),
      POL: '',
      POD: '',
      POLCountry: '',
      PODCountry: '',
      weightMeasurement: 0,
      transitionTime: 0,
      currency: CurrencyType.USD,
    })
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    removeRateTableItem(chargesType, 'oceanFreightLCL', 'items', index)
  }, [])

  const handleItemChange = useCallback(
    <P extends keyof OceanFreightLCLItem>(
      index: number,
      prop: P,
      value: ArrayElement<UniqueCollection<OceanFreightLCLItem>>[P]
    ) => {
      setRateTableItemValue(
        chargesType,
        'oceanFreightLCL',
        'items',
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
    customQuote?.destination?.portName &&
      handleItemChange(0, 'POD', customQuote?.destination?.portName)
    customQuote?.destination?.country &&
      handleItemChange(0, 'PODCountry', customQuote?.destination?.country)
    customQuote?.origin?.portName &&
      handleItemChange(0, 'POL', customQuote?.origin?.portName)
    customQuote?.origin?.country &&
      handleItemChange(0, 'POLCountry', customQuote?.origin?.country)
  }, [customQuote])

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
                onClick={() => handleRemoveItem(index)}
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
              loading={isLoading}
              onChange={e => onChangeSelect(e, 'POL', index)}
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
        {
          title: t('newRate:table.weightMeasurement'),
          dataIndex: 'weightMeasurement',
          width: 177,
          render: (price, _row, index) => (
            <InputNumber
              bordered={false}
              prefix={currencySymbol[_row.currency]}
              value={price}
              placeholder="0.00"
              controls={false}
              onChange={value =>
                handleItemChange(index, 'weightMeasurement', value || 0)
              }
              rootClassName={tableStyles.tableInput}
            />
          ),
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
              onChange={value =>
                handleItemChange(index, 'transitionTime', value || 0)
              }
              rootClassName={tableStyles.tableInput}
              formatter={formatterDays}
              parser={parserDays}
            />
          ),
        },
      ] as ColumnsType<OceanFreightLCLItem & { key: string }>,
    [i18n.language, options]
  )

  return { columns, renderFooter }
}
