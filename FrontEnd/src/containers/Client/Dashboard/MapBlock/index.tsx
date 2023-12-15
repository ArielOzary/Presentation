import React, { useCallback, useEffect, useRef } from 'react'

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { Spin } from 'antd'
import { config } from 'config'

import Shipment from './Shipment'
import {
  googleMapCenter,
  googleMapContainerStyle,
  googleMapStyle,
} from './config'

import { useGetShipmentsMapList } from 'fetchers/shipments'
import { useShipmentsDashboardStore } from 'stores/shipmentsDashboard'

import styles from './styles.module.scss'

const MapBlock: React.FC = () => {
  const { isLoaded: isMapLoaded } = useJsApiLoader({
    libraries: ['geometry', 'places'],
    googleMapsApiKey: config.GOOGLE_API_KEY,
  })

  const mapRef = useRef<google.maps.Map | null>(null)

  const filtersData = useShipmentsDashboardStore(store => store.filtersData)
  const { data, isLoading } = useGetShipmentsMapList(filtersData)

  const onLoad = useCallback((map: google.maps.Map) => {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center)
    // map.fitBounds(bounds)

    mapRef.current = map
  }, [])

  const onUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  useEffect(() => {
    if (mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds()

      data?.forEach(shipment => {
        bounds.extend(
          new window.google.maps.LatLng(
            shipment.originLatitude || 0,
            shipment.originLongitude || 0
          )
        )
        bounds.extend(
          new window.google.maps.LatLng(
            shipment.destinationLatitude || 0,
            shipment.destinationLongitude || 0
          )
        )
      })

      mapRef.current.fitBounds(bounds)
    }
  }, [mapRef.current, data])

  return (
    <div className={styles.wrapper}>
      <Spin
        spinning={!isMapLoaded || isLoading}
        wrapperClassName={styles.spinner}
      >
        <GoogleMap
          mapContainerStyle={googleMapContainerStyle}
          center={googleMapCenter}
          zoom={4}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: true,
            styles: googleMapStyle,
            maxZoom: 5,
          }}
        >
          {data?.map(shipment => (
            <Shipment key={shipment.id} {...shipment} />
          ))}
        </GoogleMap>
      </Spin>
    </div>
  )
}
export default MapBlock
