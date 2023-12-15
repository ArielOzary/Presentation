import { useCallback, useEffect, useState } from 'react'

import { FormItemProps, SelectProps } from 'antd'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useSelectControl } from './selectControl'

import { useGetIndustryTypes } from 'fetchers'
import { SelectOption } from 'models'

export const useSelectIndustryControl = <T extends FieldValues>() => {
  const { t } = useTranslation(['signUp'])

  const [options, setOptions] = useState<SelectOption<number>[]>([])

  const { data, isLoading } = useGetIndustryTypes()

  useEffect(() => {
    if (data) {
      setOptions(
        data
          .filter(type => type.id !== undefined)
          .map(type => ({
            label: type.name as string,
            value: type.id as number,
          }))
      )
    } else {
      setOptions([])
    }
  }, [data])

  const { renderSelectControl } = useSelectControl<T>()

  const renderSelectIndustryControl = useCallback(
    (itemProps?: FormItemProps, selectProps?: SelectProps) => {
      return renderSelectControl(
        { label: t('signUp:companyInfo.industry'), ...itemProps },
        {
          options,
          loading: isLoading,
          placeholder: 'Iron and steel',
          ...selectProps,
        }
      )
    },
    [options, isLoading]
  )

  return { renderSelectIndustryControl }
}
