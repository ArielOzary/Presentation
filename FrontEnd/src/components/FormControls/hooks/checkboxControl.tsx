import React, { useCallback } from 'react'

import { Checkbox, CheckboxProps, Form, FormItemProps } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseControllerReturn,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormErrorMessage } from 'models'

const { Item } = Form

export const useCheckboxControl = <T extends FieldValues>() => {
  const { t } = useTranslation()

  const handleChangeCheckbox = useCallback(
    <U extends FieldPath<T>>(field: ControllerRenderProps<T, U>) => {
      return (e: CheckboxChangeEvent) => field.onChange(e.target.checked)
    },
    []
  )

  const renderCheckboxControl = useCallback(
    (
        itemProps?: FormItemProps,
        { children, ...checkboxProps }: CheckboxProps = {}
      ) =>
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
            <Checkbox
              {...checkboxProps}
              {...field}
              checked={field.value}
              onChange={handleChangeCheckbox(field)}
            >
              {children}
            </Checkbox>
          </Item>
        ),
    []
  )

  return {
    renderCheckboxControl,
  }
}
