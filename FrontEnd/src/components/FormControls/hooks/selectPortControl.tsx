import { useCallback, useEffect, useState } from 'react'

import { FormItemProps, SelectProps } from 'antd'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useSelectControl } from './selectControl'

import { useGetPorts } from 'fetchers'
import { SelectOption } from 'models'
import { useGeoStore } from 'stores/geo'
import { useSearchQuoteStore } from 'stores/searchQuote'

export const useSelectPortControl = <T extends FieldValues>() => {
  const { t } = useTranslation(['signUp'])

  const [options, setOptions] = useState<SelectOption<number>[]>([])

  const [country, searchPortName] = useGeoStore(store => [
    store.country,
    store.searchPortName,
  ])
  const portType = useSearchQuoteStore(
    store => store.shippingType?.shipmentOption
  )

  const { data, isLoading } = useGetPorts({
    Country: country,
    PortType: portType,
    Search: searchPortName,
  })

  useEffect(() => {
    if (data?.length) {
      setOptions(
        data
          .filter(port => port.id !== undefined)
          .map(port => ({
            label: `${port.name} (${port.country})`,
            value: port.id as number,
          }))
      )
    } else {
      setOptions([])
    }
  }, [data])

  const { renderSelectControl } = useSelectControl<T>()

  const renderSelectPortControl = useCallback(
    (itemProps?: FormItemProps, selectProps?: SelectProps) => {
      return renderSelectControl(
        { label: t('signUp:companyLocation.portOfDestination'), ...itemProps },
        {
          options,
          filterOption: (inputValue, option) => true,
          loading: isLoading,
          placeholder: 'Ashdod',
          ...selectProps,
        }
      )
    },
    [isLoading, options]
  )

  return { renderSelectPortControl }
}
