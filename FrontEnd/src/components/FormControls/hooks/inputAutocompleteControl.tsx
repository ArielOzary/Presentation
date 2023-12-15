import React, { useCallback } from 'react'

import {
  AutoComplete,
  AutoCompleteProps,
  Form,
  FormItemProps,
  Input,
  InputProps,
} from 'antd'
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseControllerReturn,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormErrorMessage } from 'models'

const { Item } = Form

type Props = {
  setSearchQuery: (value: string) => void
}

export const useInputAutocompleteControl = <T extends FieldValues>({
  setSearchQuery,
}: Props) => {
  const { t } = useTranslation()

  const handleChange = useCallback(
    <U extends FieldPath<T>>(field: ControllerRenderProps<T, U>) => {
      return (e: React.ChangeEvent<HTMLInputElement>) =>
        field.onChange(setSearchQuery(e.currentTarget.value.trim()))
    },
    []
  )

  const inputAutocompleteControl = useCallback(
    (
        itemProps?: FormItemProps,
        autoCompleteProps: AutoCompleteProps = {},
        inputProps: InputProps = {}
      ) =>
      <U extends FieldPath<T>>({
        field,
        fieldState: { error },
      }: UseControllerReturn<T, U>) => {
        return (
          <Item
            validateStatus={error && 'error'}
            help={error && t(error.message as FormErrorMessage)}
            {...itemProps}
          >
            <AutoComplete {...autoCompleteProps} {...field}>
              <Input {...inputProps} onChange={handleChange(field)} />
            </AutoComplete>
          </Item>
        )
      },
    []
  )

  return { inputAutocompleteControl }
}
