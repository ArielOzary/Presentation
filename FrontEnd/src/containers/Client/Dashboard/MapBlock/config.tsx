// import { ShipmentMapDto, ShipmentOption, ShipmentStatusStage } from 'models'

export const googleMapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
]

export const DEFAULT_COLOR = '#6C5DD3'
export const DELAYED_COLOR = '#F45252'

export const googleMapContainerStyle = {
  width: '100%',
  height: '300px',
}

export const googleMapCenter = {
  lat: 31.798853,
  lng: 34.643039,
}

export const getCurvedArcPath = (
  startPoint: google.maps.LatLngLiteral,
  endPoint: google.maps.LatLngLiteral,
  numPoints = 100
): google.maps.LatLngLiteral[] => {
  const arcPath: google.maps.LatLngLiteral[] = []
  const startLatLng = new window.google.maps.LatLng(
    startPoint.lat,
    startPoint.lng
  )
  const endLatLng = new window.google.maps.LatLng(endPoint.lat, endPoint.lng)

  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints
    const curvedPoint = window.google.maps.geometry.spherical.interpolate(
      startLatLng,
      endLatLng,
      ratio
    )
    arcPath.push({ lat: curvedPoint.lat(), lng: curvedPoint.lng() })
  }

  return arcPath
}

// export const defaultData: ShipmentMapDto[] = [
//   {
//     id: '1',
//     name: '1',
//     isDelayed: true,
//     destinationPortName: 'destinationPortName1',
//     destinationPortLat: 33.747026,
//     destinationPortLon: 83.628682,
//     originPortName: 'originPortName1',
//     originPortLat: 31.798853,
//     originPortLon: 34.643039,
//     shipmentStatusStage: ShipmentStatusStage.Delayed,
//     shipmentOption: ShipmentOption.Air,
//   },
//   {
//     id: '2',
//     name: '2',
//     isDelayed: false,
//     destinationPortName: 'destinationPortName1',
//     destinationPortLat: 33.747026,
//     destinationPortLon: 83.628682,
//     originPortName: 'originPortName1',
//     originPortLat: 52.150797,
//     originPortLon: 21.415128,
//     shipmentStatusStage: ShipmentStatusStage.Delivered,
//     shipmentOption: ShipmentOption.Air,
//   },
//   {
//     id: '3',
//     name: '3',
//     isDelayed: true,
//     destinationPortName: 'destinationPortName1',
//     destinationPortLat: 37.279971,
//     destinationPortLon: 21.906194,
//     originPortName: 'originPortName1',
//     originPortLat: 31.798853,
//     originPortLon: 34.643039,
//     shipmentStatusStage: ShipmentStatusStage.Open,
//     shipmentOption: ShipmentOption.Ocean,
//   },
//   {
//     id: '4',
//     name: '4',
//     isDelayed: false,
//     destinationPortName: 'destinationPortName1',
//     destinationPortLat: 46.696,
//     destinationPortLon: 30.848565,
//     originPortName: 'originPortName1',
//     originPortLat: 31.798853,
//     originPortLon: 34.643039,
//     shipmentStatusStage: ShipmentStatusStage.NoticeOfArrival,
//     shipmentOption: ShipmentOption.Ocean,
//   },
//   {
//     id: '5',
//     name: '5',
//     isDelayed: false,
//     destinationPortName: 'destinationPortName1',
//     destinationPortLat: 37.622835,
//     destinationPortLon: -122.456048,
//     originPortName: 'originPortName1',
//     originPortLat: 31.798853,
//     originPortLon: 34.643039,
//     shipmentStatusStage: ShipmentStatusStage.EstimatedTimeOfArrival,
//     shipmentOption: ShipmentOption.Ocean,
//   },
// ]
