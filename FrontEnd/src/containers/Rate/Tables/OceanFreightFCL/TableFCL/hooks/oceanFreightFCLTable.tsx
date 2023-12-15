import React, { useCallback, useEffect, useMemo } from 'react'

import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, InputNumber, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { uniqueId } from 'lodash'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import usePortOptions from 'containers/Rate/Tables/utils/usePortOptions'

import {
  ArrayElement,
  CurrencyType,
  OceanFreightFCLItem,
  RateChargesType,
} from 'models'
import { useFreightForwarderClientsStore } from 'stores/freightForwarderClients'
import { oceanFreightLCLTableSelector, useRateStore } from 'stores/rate'

import { currencyOptions, currencySymbol } from 'utils/const'
import { UniqueCollection } from 'utils/uniqueCollection'

import tableStyles from '../../../tables.module.scss'

export const useOceanFreightFCLTable = (chargesType: RateChargesType) => {
  const { t, i18n } = useTranslation(['newRate', 'global'])
  const { addRateTableItem, removeRateTableItem, setRateTableItemValue } =
    useRateStore(
      state => oceanFreightLCLTableSelector(chargesType, state),
      shallow
    )
  const customQuote = useFreightForwarderClientsStore(
    store => store.customQuote
  )

  const { options, isLoading } = usePortOptions(1)

  const handleAddItem = useCallback(() => {
    addRateTableItem(chargesType, 'oceanFreightFCL', 'items', {
      key: uniqueId(),
      POL: '',
      POD: '',
      POLCountry: '',
      PODCountry: '',
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
    removeRateTableItem(chargesType, 'oceanFreightFCL', 'items', index)
  }, [])

  const handleItemChange = useCallback(
    <P extends keyof OceanFreightFCLItem>(
      index: number,
      prop: P,
      value: ArrayElement<UniqueCollection<OceanFreightFCLItem>>[P]
    ) => {
      setRateTableItemValue(
        chargesType,
        'oceanFreightFCL',
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
          width: 130,
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
          width: 130,
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
      ] as ColumnsType<OceanFreightFCLItem & { key: string }>,
    [i18n.language, options]
  )

  return { columns, renderFooter }
}
