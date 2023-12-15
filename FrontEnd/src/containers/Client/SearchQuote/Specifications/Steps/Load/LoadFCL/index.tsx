import React, { useCallback, useEffect, useState } from 'react'

import { DeleteOutlined, WarningOutlined } from '@ant-design/icons'
import { Alert, Button, Collapse, Form } from 'antd'
import { useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import Scrollbars from 'components/Scrollbars'

import ConfirmBtn from '../../ConfirmBtn'
import LoadFClFields from './LoadFClFields'
import { FCLSchemaType, loadFields, useFCLForm } from './hooks/fclFormSchema'

import { QuoteSteps } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import { containerTypeAbbr } from 'utils/const'

import styles from './styles.module.scss'

const { Panel } = Collapse

interface Props {
  setIsValid: (value: boolean) => void
  setStep: (value: QuoteSteps) => void
}

const LoadFCL: React.FC<Props> = ({ setIsValid, setStep }) => {
  const { t } = useTranslation(['searchQuote'])

  const [fclFormInfo, setFclFormInfo] = useSearchQuoteStore(store => [
    store.fclFormInfo,
    store.setFclFormInfo,
  ])

  const [activeKeys, setActiveKeys] = useState<string | string[]>(['0'])

  const {
    control,
    handleSubmit,
    formState: { isValidating, errors },
    watch,
  } = useFCLForm({
    defaultValues: fclFormInfo?.unit.length
      ? fclFormInfo
      : { unit: [loadFields] },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'unit',
  })

  const errorsArr = Object.values(errors)

  const infoHeader = (index: number) => {
    const changedInfo = watch().unit[index]
    return (
      <div className={styles.infoHeader}>
        <span className={styles.amount}>
          {changedInfo.unitsQuantity} {t('searchQuote:load.fclForm.containers')}
        </span>
        <span>{containerTypeAbbr[changedInfo.containerType] || 0}</span>
      </div>
    )
  }

  const handleCollapseChange = useCallback((key: string | string[]) => {
    setActiveKeys(key)
  }, [])

  const handleClickAppend = useCallback(() => {
    append(loadFields)
    setTimeout(() => {
      setActiveKeys([String(fields.length)])
    }, 0)
  }, [fields])

  const handleRemove = useCallback((index: number) => {
    return () => remove(index)
  }, [])

  const handleForm = (value: FCLSchemaType) => {
    setFclFormInfo(value)
    setStep(QuoteSteps.GOODS)
  }

  useEffect(() => {
    if (errors.unit?.map) {
      const arrIndex = errors.unit?.map((el, idx) => {
        return String(idx)
      })
      setActiveKeys(arrIndex)
    }
  }, [errors])

  useEffect(() => {
    errorsArr.length ? setIsValid(false) : setIsValid(true)
  }, [errorsArr])

  return (
    <div className={styles.formWrapper}>
      <Scrollbars className={styles.scrollBar}>
        <div className={styles.title}>{t('searchQuote:load.fclTitle')}</div>
        <Alert
          description={t('searchQuote:load.fclForm.alert')}
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          className={styles.alert}
        />
        <Form layout="vertical" onFinish={handleSubmit(handleForm)}>
          <div className={styles.loadList}>
            {fields.length === 1
              ? fields.map((item, index) => (
                  <div key={item.id}>
                    <LoadFClFields index={index} control={control} />
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
                      <LoadFClFields index={index} control={control} />
                    </Panel>
                  </Collapse>
                ))}
          </div>
          <ConfirmBtn isValidating={isValidating} isLoad>
            <Button
              type="primary"
              ghost
              onClick={handleClickAppend}
              className={styles.btnAppend}
            >
              + {t('searchQuote:load.addBtn')}
            </Button>
          </ConfirmBtn>
        </Form>
      </Scrollbars>
    </div>
  )
}

export default LoadFCL
