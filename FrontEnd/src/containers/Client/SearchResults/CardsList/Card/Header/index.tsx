import React, { useCallback, useMemo } from 'react'

import { DownOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import cn from 'classnames'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useWindowSize } from 'usehooks-ts'

import { QuoteDto, ShipmentOption } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import { M_BREAKPOINT } from 'utils/antd'
import { currencySymbol } from 'utils/const'

import styles from './styles.module.scss'

import BoatSvg from 'assets/boat.svg'
import AirPlainSvg from 'assets/mapIcons/plane.svg'
import ShipSvg from 'assets/mapIcons/ship.svg'
import PinSvg from 'assets/pin.svg'
import PlainSvg from 'assets/plain.svg'

interface Props {
  isOpen: boolean
  item: QuoteDto
  setOpen: (value: boolean) => void
  selected: boolean
}

const Header: React.FC<Props> = ({ isOpen, item, setOpen, selected }) => {
  const { t, i18n } = useTranslation(['quote', 'shipments'])

  const { width } = useWindowSize()
  const navigate = useNavigate()

  const [originInfo, destinationInfo, currency, setSelectedQuote] =
    useSearchQuoteStore(store => [
      store.originInfo,
      store.destinationInfo,
      store.currency,
      store.setSelectedQuote,
    ])

  if (!Object.keys(originInfo).length || !Object.keys(destinationInfo).length) {
    navigate('/client/search-quote')
  }

  const shipmentType = useMemo(() => {
    switch (item.shipmentOption) {
      case ShipmentOption.Air:
        return (
          <div className={styles.shipmentType}>
            <img src={AirPlainSvg} alt="air" />
            <span className={styles.type}>
              {t('shipments:shipmentTypes.air')}
            </span>
          </div>
        )

      default:
        return (
          <div className={styles.shipmentType}>
            <img src={ShipSvg} alt="ocean" />
            <span className={styles.type}>
              {t('shipments:shipmentTypes.ocean')}
            </span>
          </div>
        )
    }
  }, [item, i18n.language])

  const openToggle = useCallback(() => {
    setOpen(!isOpen)
  }, [isOpen])

  const handleRedirect = useCallback(() => {
    setSelectedQuote(item)
    navigate(`/client/search-quote/results/${item.rateId}`)
  }, [item])

  return (
    <div className={cn(styles.card, isOpen && styles.open)}>
      <div className={styles.infoBlock}>
        <div className={styles.shipmentInfo}>
          <div className={styles.title}>
            {shipmentType}
            <span className={styles.estimatedDays}>
              {t('quote:estimatedDays', {
                days: `${item.transitionTime}`,
              })}
            </span>
          </div>
          <div className={styles.road}>
            {width > M_BREAKPOINT ? (
              <>
                <img src={PinSvg} alt="origin" className={styles.pin} />
                {originInfo?.country}
                <>
                  <div className={styles.longDash} />
                  <img
                    src={
                      item.shipmentOption === ShipmentOption.Air
                        ? PlainSvg
                        : BoatSvg
                    }
                    alt="transfer"
                  />
                  <div className={styles.longDash} />
                </>
                <img src={PinSvg} alt="origin" className={styles.pin} />
                {destinationInfo?.country}
              </>
            ) : (
              <>
                <img src={PinSvg} alt="origin" className={styles.pin} />
                {originInfo?.country}
                <div className={styles.longDash} />
                <img src={PinSvg} alt="origin" className={styles.pin} />
                {destinationInfo?.country}
              </>
            )}
          </div>
          <span className={styles.provider}>{item.companyName}</span>
        </div>
        <div className={styles.priceBlock}>
          <span className={styles.estimated}>{t('quote:estimatedPrice')}</span>
          <span className={styles.price}>
            {currencySymbol[currency]} {item.totalAmout?.toFixed(2)}
          </span>
          {!selected ? (
            <Button
              type="primary"
              className={styles.btn}
              onClick={handleRedirect}
            >
              {t('quote:select')}
            </Button>
          ) : null}
          <p className={styles.expires}>
            {t('quote:expiresBy')}:{' '}
            <span>{dayjs(item.endDate).format('MMMM DD, YYYY')}</span>
          </p>
        </div>
      </div>
      <DownOutlined
        onClick={openToggle}
        className={cn(styles.icon, isOpen && styles.opened)}
      />
    </div>
  )
}

export default Header
