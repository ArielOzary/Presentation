import React, { useCallback, useMemo } from 'react'

import { RightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import useRateShipmentOptions from 'containers/Rate/GeneralInfo/ShipmentTypes/hooks/rateShipmentOptions'

import { GoodsSchemaType } from '../../Specifications/Steps/Goods/hooks/goodsForm'
import { LoadFieldsType } from '../../Specifications/Steps/Load/LoadFCL/hooks/fclFormSchema'
import { LCLShipmentSchemaType } from '../../Specifications/Steps/Load/LoadLCL/LCLShipmentForm/hooks/lclShipmentSchema'
import { UnitFieldsType } from '../../Specifications/Steps/Load/LoadLCL/LCLUnitsForm/hook/lclFormSchema'
import { useConfig } from '../../Specifications/Steps/Load/LoadLCL/hooks/config'
import { ShippingTypeSchemaType } from '../../Specifications/Steps/ShippingType/hooks/shippingTypeForm'

import { useGetAvailableList } from 'fetchers'
import {
  AvailableQuotesListDto,
  ClientQuoteDto,
  PackageType,
  ShipmentType,
} from 'models/api'
import { useSearchQuoteStore } from 'stores/searchQuote'

import {
  containerTypes,
  fclWeightFormatOptions,
  volumeFormatOptions,
} from 'utils/const'
import { dateFormat } from 'utils/formatters'

import styles from './styles.module.scss'

interface Props {
  data: ClientQuoteDto
}

const Item: React.FC<Props> = ({ data }) => {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { incoterms, types } = useRateShipmentOptions()
  const { packageTypes } = useConfig()

  const { mutate } = useGetAvailableList()

  const [
    currency,
    sortingFilter,
    sortDescending,
    setShippingType,
    setOriginInfo,
    setDestinationInfo,
    setLclUnitForm,
    setLclShipmentForm,
    setFclFormInfo,
    setGoodsInfo,
    setCompleted,
    setAvailableList,
    setIsChanging,
    setSuccess,
    setDisabled,
    setPortName,
    setPortOfDestination,
  ] = useSearchQuoteStore(store => [
    store.currency,
    store.sortingFilter,
    store.sortDescending,
    store.setShippingType,
    store.setOriginInfo,
    store.setDestinationInfo,
    store.setLclUnitForm,
    store.setLclShipmentForm,
    store.setFclFormInfo,
    store.setGoodsInfo,
    store.setCompleted,
    store.setAvailableList,
    store.setIsChanging,
    store.setSuccess,
    store.setDisabled,
    store.setPortName,
    store.setPortOfDestination,
  ])

  const incotermValue = useMemo(
    () =>
      incoterms.find(el => el.type === data.shippingType?.shipmentIncoterms)
        ?.value,
    [data]
  )

  const typeValue = useMemo(
    () => types.find(el => el.type === data.shippingType?.shipmentType)?.value,
    [data]
  )

  const loadTitle = useMemo(() => {
    const label: JSX.Element[] = []

    if (data.shippingType?.shipmentType === ShipmentType.FCL) {
      data.quoteLoads?.forEach(quote => {
        const quoteWeight = fclWeightFormatOptions.find(
          el => el.value === quote.weightFormat
        )?.label
        const quoteContainerType = containerTypes.find(
          el => el.value === quote.containerType
        )?.label
        label.push(
          <p>
            {quote.unitsQuantity} {quoteContainerType} | {quote.weight}{' '}
            {quoteWeight}
          </p>
        )
      })
    }

    if (data.shippingType?.shipmentType === ShipmentType.LCL) {
      data.quoteLoads?.forEach(quote => {
        if (quote.volume) {
          const quoteWeight = fclWeightFormatOptions.find(
            el => el.value === quote.weightFormat
          )?.label
          const quoteVolumeFormat = volumeFormatOptions.find(
            el => el.value === quote.volumeFormat
          )?.label
          label.push(
            <p>
              {quote.volume} {quoteVolumeFormat} | {quote.weight}
              {quoteWeight}
            </p>
          )
        } else if (
          quote.packageType === PackageType.BoxesOrCrates ||
          quote.packageType === PackageType.Pallets
        ) {
          const quotePackage = packageTypes.find(
            type => type.value === quote.packageType
          )?.label
          label.push(
            <p>
              {quote.unitsQuantity} {quotePackage} | {quote.length}x
              {quote.width}x{quote.height}
            </p>
          )
        }
      })
    }

    return label
  }, [data, i18n.language])

  const handleSuccess = (resp: AvailableQuotesListDto) => {
    setAvailableList(resp)

    data.shippingType &&
      setShippingType(data.shippingType as ShippingTypeSchemaType)

    if (data.origin) {
      setOriginInfo(data.origin)
      data.origin.portName && setPortName(data.origin.portName)
    }

    if (data.destination) {
      setDestinationInfo(data.destination)
      data.destination.portName &&
        setPortOfDestination(data.destination.portName)
    }

    data.quoteGood && setGoodsInfo(data.quoteGood as GoodsSchemaType)

    if (data.quoteLoads) {
      setLclUnitForm({ unit: data.quoteLoads as UnitFieldsType[] })
      setLclShipmentForm(data.quoteLoads[0] as LCLShipmentSchemaType)
      setFclFormInfo({ unit: data.quoteLoads as LoadFieldsType[] })
    }

    setCompleted(true)
    setIsChanging(false)
    setSuccess(true)
    setDisabled(false)
    if (!pathname.includes('results')) {
      navigate('/client/search-quote/results')
    }
  }

  const handleClick = useCallback(() => {
    mutate(
      {
        ...data,
        filters: {
          currencyTypeFilter: currency,
          sortingFilter,
          sortDescending,
        },
      },
      { onSuccess: handleSuccess }
    )
  }, [data, currency])

  return (
    <Button className={styles.wrapper} onClick={handleClick}>
      <div className={styles.shipping}>
        <span className={styles.type}>
          {incotermValue} | {typeValue}
        </span>
        <span className={styles.load}>{loadTitle}</span>
      </div>
      <div className={styles.originBlock}>
        <span className={styles.origin}>{data.origin?.country}</span>
        <div className={styles.iconBlock}>
          <RightOutlined className={styles.icon} />
        </div>
        <span className={styles.origin}>{data.destination?.country} </span>
      </div>
      <div className={styles.date}>
        {dayjs(data.quoteGood?.shippingDate).format(dateFormat)}
      </div>
    </Button>
  )
}

export default Item
