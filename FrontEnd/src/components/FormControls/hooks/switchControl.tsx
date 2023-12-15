import React, { useCallback } from 'react'

import { Form, FormItemProps, Switch, SwitchProps } from 'antd'
import { FieldPath, FieldValues, UseControllerReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormErrorMessage } from 'models'

const { Item } = Form

export const useSwitchControl = <T extends FieldValues>() => {
  const { t } = useTranslation()

  const renderSwitchControl = useCallback(
    (
        itemProps?: FormItemProps,
        { checkedChildren, unCheckedChildren, ...switchProps }: SwitchProps = {}
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
            <Switch
              {...switchProps}
              {...field}
              checked={field.value}
              checkedChildren={
                checkedChildren || t('global:yes' as FormErrorMessage)
              }
              unCheckedChildren={
                unCheckedChildren || t('global:no' as FormErrorMessage)
              }
            />
          </Item>
        ),
    []
  )

  return {
    renderSwitchControl,
  }
}
