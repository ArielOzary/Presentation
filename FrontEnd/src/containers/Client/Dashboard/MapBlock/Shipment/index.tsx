import React, { useMemo } from 'react'

import { Marker, Polyline } from '@react-google-maps/api'

import { DEFAULT_COLOR, DELAYED_COLOR, getCurvedArcPath } from '../config'

import { ShipmentMapDto, ShipmentOption } from 'models'

import { getShipmentProgress } from 'utils/shipmentProgress'

import planeIconUrl from 'assets/mapIcons/plane.svg'
import planeDelayIconUrl from 'assets/mapIcons/plane_delay.svg'
import shipIconUrl from 'assets/mapIcons/ship.svg'
import shipDelayIconUrl from 'assets/mapIcons/ship_delay.svg'

const Shipment: React.FC<ShipmentMapDto> = ({
  isDelayed,
  shipmentOption,
  shipmentStatusStage,
  originLatitude,
  originLongitude,
  destinationLatitude,
  destinationLongitude,
}) => {
  const originPosition: google.maps.LatLngLiteral = {
    lat: originLatitude || 0,
    lng: originLongitude || 0,
  }
  const destinationPosition: google.maps.LatLngLiteral = {
    lat: destinationLatitude || 0,
    lng: destinationLongitude || 0,
  }

  const markerIcon = useMemo(
    () => ({
      path: window.google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 4,
      fillColor: isDelayed ? DELAYED_COLOR : DEFAULT_COLOR,
    }),
    [isDelayed]
  )

  const shipmentIcon = useMemo(() => {
    let iconUrl: string

    if (shipmentOption === ShipmentOption.Air && isDelayed) {
      iconUrl = planeDelayIconUrl
    } else if (shipmentOption === ShipmentOption.Air && !isDelayed) {
      iconUrl = planeIconUrl
    } else if (shipmentOption === ShipmentOption.Ocean && isDelayed) {
      iconUrl = shipDelayIconUrl
    } else {
      iconUrl = shipIconUrl
    }

    return {
      url: iconUrl,
      scaledSize: new window.google.maps.Size(24, 24),
      anchor: new window.google.maps.Point(12, 12),
    }
  }, [isDelayed, shipmentOption])

  const polylinePath = useMemo(
    () => getCurvedArcPath(originPosition, destinationPosition),
    [originPosition, destinationPosition]
  )

  const shipmentIconPosition = useMemo(
    () =>
      polylinePath[
        Math.floor(
          polylinePath.length * (getShipmentProgress(shipmentStatusStage) / 100)
        )
      ],
    [shipmentStatusStage]
  )

  return (
    <>
      <Marker position={destinationPosition} icon={markerIcon} />
      <Marker position={originPosition} icon={markerIcon} />
      <Marker position={shipmentIconPosition} icon={shipmentIcon} />
      <Polyline
        path={polylinePath}
        options={{
          geodesic: true,
          strokeColor: isDelayed ? DELAYED_COLOR : DEFAULT_COLOR,
          strokeWeight: 1,
        }}
      />
    </>
  )
}

export default Shipment
