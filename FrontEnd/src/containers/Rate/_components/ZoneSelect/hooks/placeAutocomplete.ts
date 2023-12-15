import { useCallback, useEffect, useState } from 'react'

import { config } from 'config'
// skipcq: JS-C1003
import * as countryLookup from 'country-code-lookup'
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService'
import { useDebounce } from 'usehooks-ts'

import { SelectOption, ZoneType } from 'models'

export const usePlaceAutocomplete = (zoneType: ZoneType, country?: string) => {
  const [options, setOptions] = useState<SelectOption[]>([])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    usePlacesService({
      apiKey: config.GOOGLE_API_KEY,
    })

  const getZoneTypes = useCallback(() => {
    switch (zoneType) {
      case ZoneType.Country:
        return ['country']
      case ZoneType.State:
        return ['administrative_area_level_1']
      case ZoneType.City:
        return ['(cities)']
      default:
        return []
    }
  }, [zoneType])

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      let componentRestrictions:
        | google.maps.places.ComponentRestrictions
        | undefined = undefined

      if (country && country.length > 0) {
        const lookup = countryLookup.byCountry(country)

        if (lookup) {
          componentRestrictions = { country: lookup.iso2 }
        }
      }

      getPlacePredictions({
        input: debouncedSearch,
        componentRestrictions,
        types: getZoneTypes(),
        language: 'en',
      })
    } else {
      setOptions([])
    }
  }, [debouncedSearch])

  useEffect(() => {
    if (placePredictions.length > 0) {
      setOptions(
        placePredictions.map(prediction => {
          return {
            value: prediction.description,
            label: prediction.description,
          }
        })
      )
    }
  }, [placePredictions])

  return { search, options, isLoading: isPlacePredictionsLoading, setSearch }
}
