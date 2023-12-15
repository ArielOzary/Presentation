import React, { useCallback, useEffect, useState } from 'react'

import { ArrowRightOutlined, FormOutlined } from '@ant-design/icons'
import { Button, message } from 'antd'
import { AxiosError } from 'axios'
import cn from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'

import GeneralInfoDropdown from 'containers/Rate/_components/GeneralInfoDropdown'

import useConfig from './config'

import { useGetAvailableList } from 'fetchers'
import { AvailableQuotesListDto, QuoteSteps } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

import { ReactComponent as ErrorSvg } from 'assets/searchQuoteIcons/error.svg'
import { ReactComponent as SuccessSvg } from 'assets/searchQuoteIcons/success.svg'

const Specifications: React.FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [
    shippingType,
    originInfo,
    destinationInfo,
    lclUnitForm,
    lclShipmentForm,
    fclFormInfo,
    goodsInfo,
    completed,
    isDisabled,
    isChanging,
    currency,
    sortingFilter,
    sortDescending,
    requestedCustomQuote,
    setCompleted,
    setAvailableList,
    setIsChanging,
    setSuccess,
    setDisabled,
  ] = useSearchQuoteStore(store => [
    store.shippingType,
    store.originInfo,
    store.destinationInfo,
    store.lclUnitForm,
    store.lclShipmentForm,
    store.fclFormInfo,
    store.goodsInfo,
    store.completed,
    store.isDisabled,
    store.isChanging,
    store.currency,
    store.sortingFilter,
    store.sortDescending,
    store.requestedCustomQuote,
    store.setCompleted,
    store.setAvailableList,
    store.setIsChanging,
    store.setSuccess,
    store.setDisabled,
  ])

  const [step, setStep] = useState<QuoteSteps>(
    completed ? QuoteSteps.COMPLETED : QuoteSteps.SHIPPING_TYPE
  )
  const [isValid, setIsValid] = useState<boolean>(true)

  const { mutate, isLoading } = useGetAvailableList()

  const { specificBlocks, mutateData } = useConfig(setIsValid, setStep)

  const handleSuccess = (data: AvailableQuotesListDto) => {
    setAvailableList(data)
    setSuccess(true)
    if (!pathname.includes('results')) {
      navigate('/client/search-quote/results')
    }
  }

  const handleError = useCallback((error: AxiosError) => {
    message.error(error.message)
  }, [])

  const handleFinishClick = useCallback(() => {
    if (completed && !requestedCustomQuote)
      mutate(
        {
          ...mutateData,
          filters: {
            currencyTypeFilter: currency,
            sortingFilter,
            sortDescending,
          },
        },
        { onSuccess: handleSuccess, onError: handleError }
      )
    setIsChanging(false)
    setStep(QuoteSteps.COMPLETED)
  }, [completed, mutateData, currency, sortingFilter, sortDescending])

  const handleEditClick = useCallback(() => {
    setIsChanging(true)
  }, [])

  useEffect(() => {
    if (
      shippingType &&
      originInfo &&
      destinationInfo &&
      (lclUnitForm || lclShipmentForm || fclFormInfo) &&
      goodsInfo
    ) {
      setDisabled(false)
      setCompleted(true)
    } else {
      setDisabled(true)
      setCompleted(false)
    }
  }, [step])

  return (
    <div
      className={cn(
        styles.wrapper,
        pathname.includes('results') && styles.completed
      )}
    >
      {specificBlocks?.map(block => (
        <GeneralInfoDropdown
          key={block.id}
          step={step}
          setStep={setStep}
          currentStep={block.id}
          title={
            <span className={styles.title}>
              {block.title} {step === block.id && !isValid && <ErrorSvg />}
              {(step > block.id || completed) && <SuccessSvg />}
            </span>
          }
          value={block.label}
        >
          {block.children}
        </GeneralInfoDropdown>
      ))}
      <Button
        type="primary"
        loading={isLoading}
        icon={
          pathname.includes('results') ? (
            !isChanging ? (
              <FormOutlined />
            ) : (
              <ArrowRightOutlined />
            )
          ) : (
            <ArrowRightOutlined />
          )
        }
        disabled={isDisabled}
        onClick={
          pathname.includes('results')
            ? !isChanging
              ? handleEditClick
              : handleFinishClick
            : handleFinishClick
        }
        className={styles.searchBtn}
      />
    </div>
  )
}

export default Specifications
