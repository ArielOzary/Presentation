import React, { useCallback } from 'react'

import { Form, FormItemProps, Input, InputProps } from 'antd'
import { FieldPath, FieldValues, UseControllerReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormErrorMessage } from 'models'

const { Item } = Form

export const useInputControl = <T extends FieldValues>() => {
  const { t } = useTranslation()

  const renderInputControl = useCallback(
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
            <Input {...inputProps} {...field} />
          </Item>
        ),
    []
  )

  return {
    renderInputControl,
  }
}
