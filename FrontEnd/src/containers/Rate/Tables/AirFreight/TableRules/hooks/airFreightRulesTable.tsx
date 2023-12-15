import React, { useCallback, useMemo } from 'react'

import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, InputNumber, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import {
  RateChargesType,
  RateRule,
  RuleItem,
  SelectOption,
  TableType,
} from 'models'
import { airFreightTableSelector, useRateStore } from 'stores/rate'

import {
  dimensionFormatOptions,
  useOptions,
  weightFormatOptions,
} from 'utils/const'
import { UniqueCollection } from 'utils/uniqueCollection'

import tableStyles from '../../../tables.module.scss'

export const useAirFreightRulesTable = (
  chargesType: RateChargesType,
  tableType: Extract<TableType, 'airFreight' | 'inLand'>,
  rules: UniqueCollection<RuleItem>
) => {
  const { t, i18n } = useTranslation(['newRate', 'global'])
  const { rateRuleOptions } = useOptions()
  const { addRateRuleItem, removeRateRuleItem, setRateRuleItemValue } =
    useRateStore(state => airFreightTableSelector(chargesType, state), shallow)

  const handleAddItem = useCallback(() => {
    addRateRuleItem(chargesType, tableType)
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    removeRateRuleItem(chargesType, tableType, index)
  }, [])

  const handleItemChange = useCallback(
    <P extends keyof RuleItem>(index: number, prop: P, value: RuleItem[P]) => {
      setRateRuleItemValue(chargesType, tableType, index, prop, value)
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
        disabled={rules.length >= 4}
      >
        {t('newRate:table.addItem')}
      </Button>
    ),
    [rules, i18n.language]
  )

  const usedRules = useMemo(() => rules.map(item => item.rule), [rules])
  const allowedRuleOptions = useMemo(
    () =>
      rateRuleOptions.map(option => ({
        ...option,
        disabled: usedRules.includes(option.value),
      })),
    [usedRules]
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
          title: t('newRate:table.rule'),
          dataIndex: 'rule',
          width: 200,
          render: (rule, _row, index) => (
            <Select
              value={rule}
              onChange={value => handleItemChange(index, 'rule', value)}
              options={allowedRuleOptions}
              className={tableStyles.tableInput}
              bordered={false}
            />
          ),
        },
        {
          title: t('newRate:table.max'),
          dataIndex: 'value',
          width: 200,
          render: (value, _row, index) => {
            const isDimensionFormat =
              _row.rule === RateRule.MaxHeightPerPallette ||
              _row.rule === RateRule.MaxHeightPerShipment

            return (
              <div className={tableStyles.dimensionInputGroup}>
                <InputNumber
                  bordered={false}
                  value={value}
                  placeholder="0.00"
                  controls={false}
                  onChange={value =>
                    handleItemChange(index, 'value', value || 0)
                  }
                  className={tableStyles.input}
                />
                <Select
                  value={
                    isDimensionFormat ? _row.dimensionFormat : _row.weightFormat
                  }
                  onChange={value =>
                    handleItemChange(
                      index,
                      isDimensionFormat ? 'dimensionFormat' : 'weightFormat',
                      value
                    )
                  }
                  options={
                    (isDimensionFormat
                      ? dimensionFormatOptions
                      : weightFormatOptions) as SelectOption<number>[]
                  }
                  className={tableStyles.select}
                />
              </div>
            )
          },
        },
      ] as ColumnsType<RuleItem & { key: string }>,
    [allowedRuleOptions, i18n.language]
  )

  return { columns, renderFooter }
}
