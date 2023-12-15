import React, { useEffect, useState } from 'react'

import { GoogleMap, Marker } from '@react-google-maps/api'

import { useGetTrackContainer } from 'fetchers/tracking'
import { useShipmentsDashboardStore } from 'stores/shipmentsDashboard'

const GPS: React.FC = () => {
  const shipment = useShipmentsDashboardStore(store => store.shipment)

  const { data } = useGetTrackContainer(
    shipment?.containerNumberOrVesselName || '',
    { enabled: !shipment.containerNumberOrVesselName }
  )

  const [currentLocation, setCurrentLocation] = useState<
    google.maps.LatLng | google.maps.LatLngLiteral
  >({ lat: 0, lng: 0 })

  useEffect(() => {
    if (data) {
      setCurrentLocation({
        lat: data.data?.routeData?.pin?.[0] || 0,
        lng: data.data?.routeData?.pin?.[1] || 0,
      })
    }
  }, [data])

  return (
    <GoogleMap center={currentLocation} zoom={data ? 15 : 3}>
      {data && <Marker position={currentLocation} />}
    </GoogleMap>
  )
}

export default GPS
