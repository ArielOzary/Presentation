import React, { useCallback, useMemo } from 'react'

import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, InputNumber, Select, Switch, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { uniqueId } from 'lodash'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import {
  ArrayElement,
  CurrencyType,
  FixedPriceItem,
  RateChargesType,
} from 'models'
import { fixedPriceTableSelector, useRateStore } from 'stores/rate'

import { currencyOptions, currencySymbol } from 'utils/const'
import { UniqueCollection } from 'utils/uniqueCollection'

import tableStyles from '../../tables.module.scss'
import styles from '../styles.module.scss'

export const useFixedPricesTable = (chargesType: RateChargesType) => {
  const { t, i18n } = useTranslation(['newRate', 'global'])
  const {
    fixedPrices,
    setRateTableValue,
    addRateTableItem,
    removeRateTableItem,
    setRateTableItemValue,
  } = useRateStore(
    state => fixedPriceTableSelector(chargesType, state),
    shallow
  )

  const handleChangeCurrency = useCallback((value: CurrencyType) => {
    setRateTableValue(chargesType, 'fixedPriced', 'currency', value)
  }, [])

  const handleAddItem = useCallback(() => {
    addRateTableItem(chargesType, 'fixedPriced', 'items', {
      key: uniqueId(),
      name: '',
      price: 0,
      required: true,
    })
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    removeRateTableItem(chargesType, 'fixedPriced', 'items', index)
  }, [])

  const handleItemChange = useCallback(
    <P extends keyof FixedPriceItem>(
      index: number,
      prop: P,
      value: ArrayElement<UniqueCollection<FixedPriceItem>>[P]
    ) => {
      setRateTableItemValue(
        chargesType,
        'fixedPriced',
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

  const renderPriceColTitle = useCallback(() => {
    return (
      <div className={styles.priceRow}>
        <Typography.Text>{t('newRate:table.price')}</Typography.Text>
        <Select
          value={fixedPrices?.currency}
          onChange={handleChangeCurrency}
          options={currencyOptions}
          className={tableStyles.headerSelect}
        />
      </div>
    )
  }, [fixedPrices?.currency, i18n.language])

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
          title: t('newRate:table.name'),
          dataIndex: 'name',
          render: (name: string, _row, index) => (
            <Input
              bordered={false}
              className={tableStyles.tableInput}
              placeholder={t('newRate:table.fixedPriceName')}
              value={name}
              onChange={e => handleItemChange(index, 'name', e.target.value)}
            />
          ),
        },
        {
          title: renderPriceColTitle,
          dataIndex: 'price',
          width: 250,
          render: (price: number, _row, index) => (
            <InputNumber
              bordered={false}
              prefix={currencySymbol[fixedPrices?.currency || CurrencyType.USD]}
              value={price}
              placeholder="0.00"
              controls={false}
              onChange={value => handleItemChange(index, 'price', value || 0)}
              rootClassName={tableStyles.tableInput}
            />
          ),
        },
        {
          title: t('newRate:table.ifRequired'),
          dataIndex: 'required',
          render: (required: boolean, _row, index) => (
            <Switch
              checkedChildren={t('global:yes')}
              unCheckedChildren={t('global:no')}
              checked={required}
              onChange={value => handleItemChange(index, 'required', value)}
            />
          ),
          width: 137,
        },
      ] as ColumnsType<FixedPriceItem & { key: string }>,
    [renderPriceColTitle, i18n.language]
  )

  return { columns, renderFooter }
}
