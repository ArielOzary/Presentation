import React, { useCallback } from 'react'

import { Form, FormItemProps, Select, SelectProps } from 'antd'
import { FieldPath, FieldValues, UseControllerReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormErrorMessage } from 'models'

const { Item } = Form

export const useSelectControl = <T extends FieldValues>() => {
  const { t } = useTranslation()

  const renderSelectControl =
    (itemProps?: FormItemProps, selectProps?: SelectProps) =>
    <U extends FieldPath<T>>({
      field,
      fieldState: { error },
    }: UseControllerReturn<T, U>) =>
      (
        <Item
          validateStatus={error && 'error'}
          help={error && t(error.message as FormErrorMessage)}
          {...itemProps}
        >
          <Select {...selectProps} {...field} />
        </Item>
      )

  return { renderSelectControl }
}
