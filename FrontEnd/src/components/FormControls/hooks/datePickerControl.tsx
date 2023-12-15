import React, { useCallback } from 'react'

import { DatePicker, DatePickerProps, Form, FormItemProps } from 'antd'
import { FieldPath, FieldValues, UseControllerReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormErrorMessage } from 'models'

import { dateFormat } from 'utils/formatters'

const { Item } = Form

export const useDatePickerControl = <T extends FieldValues>() => {
  const { t } = useTranslation()

  const renderDatePickerControl = useCallback(
    (itemProps?: FormItemProps, datePickerProps?: DatePickerProps) =>
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
            <DatePicker format={dateFormat} {...datePickerProps} {...field} />
          </Item>
        ),
    []
  )

  return {
    renderDatePickerControl,
  }
}
