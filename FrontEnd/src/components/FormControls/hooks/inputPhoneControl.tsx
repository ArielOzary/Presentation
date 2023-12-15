import React, { useCallback } from 'react'

import { Form, FormItemProps } from 'antd'
import { FieldPath, FieldValues, UseControllerReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import PhoneInput, { PhoneInputProps } from 'components/PhoneInput'

import { FormErrorMessage } from 'models'

const { Item } = Form

export const useInputPhoneControl = <T extends FieldValues>() => {
  const { t } = useTranslation()

  const renderInputPhoneControl = useCallback(
    (itemProps?: FormItemProps, phoneInputProps?: PhoneInputProps) =>
      <U extends FieldPath<T>>({
        field,
        fieldState: { error },
        formState: { isValidating },
      }: UseControllerReturn<T, U>) =>
        (
          <Item
            help={error && t(error.message as FormErrorMessage)}
            // hasFeedback
            validateStatus={
              isValidating ? 'validating' : error ? 'error' : undefined
            }
            {...itemProps}
          >
            <PhoneInput
              status={error && 'error'}
              {...phoneInputProps}
              {...field}
            />
          </Item>
        ),
    []
  )

  return {
    renderInputPhoneControl,
  }
}
