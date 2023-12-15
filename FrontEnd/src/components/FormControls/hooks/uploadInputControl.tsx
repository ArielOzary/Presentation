import React, { useCallback } from 'react'

import { Form, FormItemProps, Upload, UploadProps } from 'antd'
import { FieldPath, FieldValues, UseControllerReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormErrorMessage } from 'models'

const { Item } = Form

const useUploadInputControl = <T extends FieldValues>() => {
  const { t } = useTranslation()

  const renderUploadInputControl = useCallback(
    (
        itemProps?: FormItemProps,
        { children, ...uploadProps }: UploadProps = {}
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
            <Upload {...uploadProps} {...field}>
              {children}
            </Upload>
          </Item>
        ),
    []
  )

  return { renderUploadInputControl }
}

export default useUploadInputControl
