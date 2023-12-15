import React, { useCallback } from 'react'

import { Form, FormItemProps, Input, InputProps } from 'antd'
import { FieldPath, FieldValues, UseControllerReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormErrorMessage } from 'models'

const { Item } = Form

export const useInputPasswordControl = <T extends FieldValues>() => {
  const { t } = useTranslation()

  const renderInputPasswordControl = useCallback(
    (itemProps?: FormItemProps, inputProps?: InputProps) =>
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
            <Input.Password
              placeholder="●●●●●●●●●●●●●"
              {...inputProps}
              {...field}
            />
          </Item>
        ),
    []
  )

  return {
    renderInputPasswordControl,
  }
}
