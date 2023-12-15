import React, { useEffect, useState } from 'react'

import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Space, UploadFile } from 'antd'
import dayjs from 'dayjs'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useDatePickerControl } from 'components/FormControls/hooks/datePickerControl'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import useInputNumberControl from 'components/FormControls/hooks/inputNumberControl'
import { useSelectControl } from 'components/FormControls/hooks/selectControl'
import { useSwitchControl } from 'components/FormControls/hooks/switchControl'
import useUploadInputControl from 'components/FormControls/hooks/uploadInputControl'

import ConfirmBtn from '../ConfirmBtn'
import { GoodsSchemaType, defaultValues, useGoodsForm } from './hooks/goodsForm'

import { QuoteSteps } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import { currencyOptions } from 'utils/const'
import { useDisabledDate } from 'utils/disabledDate'
import { handleKeyPress } from 'utils/handleKeyPress'

import styles from './styles.module.scss'

interface Props {
  setIsValid: (value: boolean) => void
  setStep: (value: QuoteSteps) => void
}

const Goods: React.FC<Props> = ({ setIsValid, setStep }) => {
  const { t } = useTranslation(['searchQuote', 'createSupplier'])

  const [goodsInfo, setGoodsInfo] = useSearchQuoteStore(store => [
    store.goodsInfo,
    store.setGoodsInfo,
  ])

  const { disabledStartDate } = useDisabledDate()

  const { renderInputControl } = useInputControl<GoodsSchemaType>()
  const { renderSelectControl } = useSelectControl<GoodsSchemaType>()
  const { renderDatePickerControl } = useDatePickerControl<GoodsSchemaType>()
  const { renderSwitchControl } = useSwitchControl<GoodsSchemaType>()
  const { renderUploadInputControl } = useUploadInputControl<GoodsSchemaType>()
  const { renderInputNumberControl } = useInputNumberControl<GoodsSchemaType>()

  const [fileList, setFileList] = useState<UploadFile[]>(
    goodsInfo?.file ? goodsInfo.file.fileList : []
  )

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValidating, errors },
  } = useGoodsForm({
    defaultValues: goodsInfo
      ? {
          ...goodsInfo,
          shippingDate: dayjs(goodsInfo.shippingDate) as unknown as string,
        }
      : defaultValues,
  })

  const errorsArr = Object.values(errors)

  const handleRemove = (file: UploadFile) => {
    const index = fileList.indexOf(file)
    const newFileList = fileList.slice()
    newFileList.splice(index, 1)
    setFileList(newFileList)
  }

  const handleBeforeUpload = (file: UploadFile) => {
    setFileList([...fileList, file])

    return false
  }

  const handleForm = (data: GoodsSchemaType) => {
    setGoodsInfo(data)
    setStep(QuoteSteps.COMPLETED)
  }

  useEffect(() => {
    errorsArr.length ? setIsValid(false) : setIsValid(true)
  }, [errorsArr])

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{t('searchQuote:goods.label')}</div>
      <Form layout="vertical" onFinish={handleSubmit(handleForm)}>
        <Controller
          name="description"
          control={control}
          render={renderInputControl(
            { label: <strong>{t('searchQuote:goods.label')}</strong> },
            {
              placeholder: t('searchQuote:goods.descrOfItems'),
              maxLength: 50,
              size: 'large',
            }
          )}
        />
        <div className={styles.formRow}>
          <Space.Compact className={styles.inputAddon}>
            <Controller
              name="value"
              control={control}
              render={renderInputNumberControl(
                {
                  label: (
                    <strong>
                      {t('searchQuote:goods.title')}{' '}
                      {t('searchQuote:goods.value')}
                    </strong>
                  ),
                },
                {
                  placeholder: '0',
                  controls: false,
                  onKeyPress: handleKeyPress,
                }
              )}
            />
            <Controller
              name="currencyType"
              control={control}
              render={renderSelectControl(
                { label: <div /> },
                {
                  options: currencyOptions,
                  className: styles.select,
                }
              )}
            />
          </Space.Compact>
          <Controller
            name="shippingDate"
            control={control}
            render={renderDatePickerControl(
              { label: <strong>{t('searchQuote:goods.shippingDate')}</strong> },
              { disabledDate: disabledStartDate, className: styles.dataPicker }
            )}
          />
        </div>
        <div className={styles.dangerBlock}>
          <Controller
            control={control}
            name="dangerous"
            render={renderSwitchControl({
              label: (
                <strong>
                  {t('searchQuote:goods.dangerous')}{' '}
                  {t('searchQuote:goods.title')}
                </strong>
              ),
            })}
          />
          {watch().dangerous && (
            <Controller
              name="un"
              control={control}
              render={renderInputControl(
                {
                  label: <strong>{t('searchQuote:goods.unNumber')}</strong>,
                  className: styles.unInput,
                },

                {
                  placeholder: t('searchQuote:goods.enterNumber'),
                  size: 'large',
                  onKeyPress: handleKeyPress,
                }
              )}
            />
          )}
        </div>
        {watch().dangerous && (
          <Controller
            name="file"
            control={control}
            render={renderUploadInputControl(
              {
                label: <strong>{t('createSupplier:upload')}</strong>,
              },
              {
                listType: 'picture',
                fileList,
                beforeUpload: handleBeforeUpload,
                onRemove: handleRemove,
                children: (
                  <Button
                    icon={<UploadOutlined />}
                    className={styles.uploadBtn}
                  >
                    {t('createSupplier:click')}
                  </Button>
                ),
              }
            )}
          />
        )}
        <ConfirmBtn isValidating={isValidating} isLoad={false} />
      </Form>
    </div>
  )
}

export default Goods
