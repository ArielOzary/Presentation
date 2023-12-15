import React, { useCallback, useMemo } from 'react'

import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, InputNumber, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { useHelpers } from 'containers/Rate/Tables/helpers'

import ZoneSelect from '../../../../_components/ZoneSelect'

import { InLandZoneItem, RateChargesType, ZoneType } from 'models'
import { inLandTableSelector, useRateStore } from 'stores/rate'

import { useOptions } from 'utils/const'

import tableStyles from '../../../tables.module.scss'

export const useInLandZonesTable = (chargesType: RateChargesType) => {
  const { t, i18n } = useTranslation(['newRate', 'global'])
  const { parserDays, formatterDays } = useHelpers()
  const { zoneTypeOptions } = useOptions()

  const {
    addRateInLandZoneItem,
    removeRateInLandZoneItem,
    setRateInLandZoneItemValue,
  } = useRateStore(state => inLandTableSelector(chargesType, state), shallow)

  const handleAddItem = useCallback(() => {
    addRateInLandZoneItem(chargesType)
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    return () => removeRateInLandZoneItem(chargesType, index)
  }, [])

  const decodeStateAbbr = async (stateAbbreviation: string) => {
    const geocoder = new google.maps.Geocoder()
    let stateName = ''

    await geocoder.geocode(
      { address: stateAbbreviation, language: 'en' },
      (results, status) => {
        if (status == 'OK' && results) {
          const location = results[0]
          for (const component of location.address_components) {
            if (component.types.includes('administrative_area_level_1')) {
              stateName = component.long_name
              break
            }
          }
        }
      }
    )
    return stateName
  }

  const fullState = async (lastValue: string) => {
    let place = lastValue

    const splittedValue = lastValue.split(',')
    let stateName = ''
    if (splittedValue.length === 3) {
      stateName = await decodeStateAbbr(
        `${splittedValue[1]},${splittedValue[2]}`
      )
      place = `${splittedValue[0]}, ${stateName},${splittedValue[2]}`
    }

    return place
  }

  const handleItemChange = useCallback(
    async <P extends keyof InLandZoneItem>(
      index: number,
      prop: P,
      value: InLandZoneItem[P]
    ) => {
      if (prop === 'zoneName' && typeof value === 'string') {
        const lastValue = value.split(';')

        const resp = await fullState(lastValue.at(-1) as string)
        lastValue.pop()
        lastValue.push(resp)
        setRateInLandZoneItemValue(
          chargesType,
          index,
          prop,
          lastValue.join(';') as string
        )
      } else setRateInLandZoneItemValue(chargesType, index, prop, value)
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
          title: t('newRate:table.zoneType'),
          dataIndex: 'zoneType',
          width: 100,
          render: (zoneType, _row, index) => (
            <Select
              value={zoneType}
              onChange={value => handleItemChange(index, 'zoneType', value)}
              options={zoneTypeOptions}
              className={tableStyles.tableInput}
              bordered={false}
            />
          ),
        },
        {
          title: t('newRate:table.zoneName'),
          dataIndex: 'zoneName',
          width: 200,
          render: (zoneName, _row, index) => (
            <ZoneSelect
              zoneType={_row.zoneType}
              value={zoneName === '' ? [] : zoneName.split(';')}
              onChange={value =>
                handleItemChange(index, 'zoneName', value.join(';'))
              }
              className={tableStyles.autocompleteSelect}
            />
          ),
        },
        {
          title: t('newRate:table.fromRange'),
          dataIndex: 'zipRangeFrom',
          width: 100,
          render: (zipRangeFrom, _row, index) => (
            <InputNumber
              bordered={false}
              value={_row.zoneType !== ZoneType.ZIP ? '' : zipRangeFrom}
              placeholder={_row.zoneType === ZoneType.ZIP ? '14000' : ''}
              controls={false}
              onChange={value =>
                handleItemChange(index, 'zipRangeFrom', value || 0)
              }
              rootClassName={tableStyles.tableInput}
              disabled={_row.zoneType !== ZoneType.ZIP}
            />
          ),
        },
        {
          title: t('newRate:table.tilRange'),
          dataIndex: 'zipRangeTo',
          width: 100,
          render: (zipRangeTo, _row, index) => (
            <InputNumber
              bordered={false}
              value={_row.zoneType !== ZoneType.ZIP ? '' : zipRangeTo}
              placeholder={_row.zoneType === ZoneType.ZIP ? '14300' : ''}
              controls={false}
              onChange={value =>
                handleItemChange(index, 'zipRangeTo', value || 0)
              }
              rootClassName={tableStyles.tableInput}
              disabled={_row.zoneType !== ZoneType.ZIP}
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
      ] as ColumnsType<InLandZoneItem & { key: string }>,
    [i18n.language]
  )

  return { columns, renderFooter }
}
