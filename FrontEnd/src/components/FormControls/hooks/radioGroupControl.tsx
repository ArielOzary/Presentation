import React, { useCallback } from 'react'

import { Form, FormItemProps, Radio, RadioGroupProps } from 'antd'
import { FieldPath, FieldValues, UseControllerReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormErrorMessage } from 'models'

const { Item } = Form

export const useRadioGroupControl = <T extends FieldValues>() => {
  const { t } = useTranslation()

  const renderRadioGroupControl = useCallback(
    (
        itemProps?: FormItemProps,
        { children, ...checkboxProps }: RadioGroupProps = {}
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
            <Radio.Group {...checkboxProps} {...field}>
              {children}
            </Radio.Group>
          </Item>
        ),
    []
  )

  return { renderRadioGroupControl }
}
