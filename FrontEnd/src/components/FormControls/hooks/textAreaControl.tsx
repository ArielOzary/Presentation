import React, { useCallback } from 'react'

import { Form, FormItemProps, Input } from 'antd'
import { TextAreaProps } from 'antd/es/input'
import { FieldPath, FieldValues, UseControllerReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormErrorMessage } from 'models'

const { Item } = Form
const { TextArea } = Input

export const useTextAreaControl = <T extends FieldValues>() => {
  const { t } = useTranslation()

  const renderTextAreaControl = useCallback(
    (itemProps?: FormItemProps, textAreaProps?: TextAreaProps) =>
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
            <TextArea {...textAreaProps} {...field} />
          </Item>
        ),
    []
  )

  return {
    renderTextAreaControl,
  }
}
