import React, { useCallback, useEffect, useState } from 'react'

import { DeleteOutlined } from '@ant-design/icons'
import { Button, Collapse, Form } from 'antd'
import { useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import ConfirmBtn from '../../../ConfirmBtn'
import { useConfig } from '../hooks/config'
import LCLFormFields from './LCLFormFields'
import { LCLSchemaType, unitFields, useLCLForm } from './hook/lclFormSchema'

import { DimensionsFormat, QuoteSteps, WeightFormat } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

const { Panel } = Collapse

interface Props {
  setIsValid: (value: boolean) => void
  setStep: (value: QuoteSteps) => void
}

const LCLUnitsForm: React.FC<Props> = ({ setIsValid, setStep }) => {
  const { t } = useTranslation(['searchQuote'])
  const { packageTypes } = useConfig()

  const [activeKeys, setActiveKeys] = useState<string | string[]>(['0'])

  const [lclUnitForm, setLclUnitForm] = useSearchQuoteStore(store => [
    store.lclUnitForm,
    store.setLclUnitForm,
  ])

  const {
    control,
    handleSubmit,
    formState: { errors, isValidating },
    watch,
  } = useLCLForm({
    defaultValues: lclUnitForm?.unit.length
      ? lclUnitForm
      : { unit: [unitFields] },
  })

  const errorsArr = Object.values(errors)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'unit',
  })

  const infoHeader = (index: number) => {
    const changedInfo = watch().unit[index]
    const packageType = packageTypes.find(
      el => el.value === changedInfo.packageType
    )?.label

    return (
      <div className={styles.infoHeader}>
        <span className={styles.amount}>
          {changedInfo.unitsQuantity} {packageType}
        </span>
        <span>
          {changedInfo.length || 0}x{changedInfo.width || 0}x
          {changedInfo.height || 0}{' '}
          {DimensionsFormat[changedInfo.dimensionsFormat]} |{' '}
          {changedInfo.weightPerUnit || 0}{' '}
          {WeightFormat[changedInfo.weightFormat]}
        </span>
      </div>
    )
  }

  const errorText = useCallback(
    (indx: number) => () => {
      if (!errors) return

      let isErrorExist = false

      if (errors.unit?.forEach && errors.unit?.[indx]) {
        errors.unit?.forEach(field => {
          if (field?.height || field?.length || field?.width) {
            isErrorExist = true
          }
        })
      }

      // skipcq JS-0045
      return isErrorExist ? (
        <span className={styles.dimensionsError}>
          {t('searchQuote:load.lclForm.error.fillDimensions')}
        </span>
      ) : null
    },
    [errors]
  )

  const handleCollapseChange = useCallback((key: string | string[]) => {
    setActiveKeys(key)
  }, [])

  const handleClickAppend = useCallback(() => {
    append(unitFields)
    setTimeout(() => {
      setActiveKeys([String(fields.length)])
    }, 0)
  }, [fields])

  const handleRemove = useCallback((index: number) => {
    return () => remove(index)
  }, [])

  const handleForm = (value: LCLSchemaType) => {
    setLclUnitForm(value)
    setStep(QuoteSteps.GOODS)
  }

  useEffect(() => {
    if (errors.unit?.map) {
      const arrIndex = errors.unit.map((el, idx) => {
        return String(idx)
      })
      setActiveKeys(arrIndex)
    }
  }, [errors])

  useEffect(() => {
    errorsArr.length ? setIsValid(false) : setIsValid(true)
  }, [errorsArr])

  return (
    <Form layout="vertical" onFinish={handleSubmit(handleForm)}>
      <div className={styles.loadList}>
        {fields.length === 1
          ? fields.map((item, index) => (
              <div key={item.id}>
                <LCLFormFields
                  index={index}
                  control={control}
                  errorText={errorText(index)}
                />
              </div>
            ))
          : fields.map((item, index) => (
              <Collapse
                key={item.id}
                activeKey={activeKeys}
                onChange={handleCollapseChange}
              >
                <Panel
                  header={
                    <div className={styles.label}>
                      <span>
                        {t('searchQuote:load.title')} {index + 1}
                      </span>
                      {activeKeys.includes(String(index)) ? (
                        <div />
                      ) : (
                        infoHeader(index)
                      )}
                      <DeleteOutlined
                        className={styles.icon}
                        onClick={handleRemove(index)}
                      />
                    </div>
                  }
                  key={index} // skipcq JS-0437
                  showArrow={false}
                  className={styles.panel}
                >
                  <LCLFormFields
                    index={index}
                    control={control}
                    errorText={errorText(index)}
                  />
                </Panel>
              </Collapse>
            ))}
      </div>
      <ConfirmBtn isValidating={isValidating} isLoad>
        <Button
          type="primary"
          ghost
          className={styles.btnAppend}
          onClick={handleClickAppend}
        >
          + {t('searchQuote:load.addBtn')}
        </Button>
      </ConfirmBtn>
    </Form>
  )
}

export default LCLUnitsForm
