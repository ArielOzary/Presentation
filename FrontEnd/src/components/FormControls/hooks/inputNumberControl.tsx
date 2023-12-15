import React, { useCallback } from 'react'

import { Form, FormItemProps, InputNumber, InputNumberProps } from 'antd'
import { FieldPath, FieldValues, UseControllerReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormErrorMessage } from 'models'

type Dimensions = {
  dimensions: boolean
}

const useInputNumberControl = <T extends FieldValues>() => {
  const { t } = useTranslation(['searchQuote', 'global'])

  const renderInputNumberControl = useCallback(
    (
        itemProps?: FormItemProps,
        inputProps?: InputNumberProps,
        option?: Dimensions
      ) =>
      <U extends FieldPath<T>>({
        field,
        fieldState: { error },
      }: UseControllerReturn<T, U>) =>
        (
          <Form.Item
            {...itemProps}
            validateStatus={error && 'error'}
            help={
              !option?.dimensions &&
              error &&
              t(error.message as FormErrorMessage)
            }
          >
            <InputNumber {...inputProps} {...field} />
          </Form.Item>
        ),
    []
  )

  return { renderInputNumberControl }
}

export default useInputNumberControl
