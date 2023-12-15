import React, {
  ForwardRefExoticComponent,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { InputProps, InputRef, Select } from 'antd'
import { MaskedInput } from 'antd-mask-input-for-andtv5'
import { MaskedInputProps } from 'antd-mask-input-for-andtv5/build/main/lib/MaskedInput'
import CountryList, { Country } from 'country-list-with-dial-code-and-flag'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { Emojione } from 'react-emoji-render'
import { useTranslation } from 'react-i18next'

import { phoneFormatter, phoneInputMask } from 'utils/formatters'
import { useForwardRef } from 'utils/hooks/useForwardRef'

import styles from './styles.module.scss'

type OnChangeParam = Parameters<Exclude<InputProps['onChange'], undefined>>[0]
interface OnChangeEvent extends OnChangeParam {
  maskedValue: string
  unmaskedValue: string
}

export interface PhoneInputProps
  extends Omit<MaskedInputProps, 'mask' | 'maskOptions' | 'onChange'> {
  onChange: (value: string) => void
}

interface IndexedCountry
  extends Pick<Country, 'code' | 'dialCode' | 'name' | 'flag'> {
  index: number
}

const countries: IndexedCountry[] = CountryList.getAll().map(
  (country, index) => ({
    code: country.code,
    dialCode: country.dialCode,
    name: country.name,
    flag: country.flag,
    index,
  })
)

const PhoneInput: ForwardRefExoticComponent<PhoneInputProps> = forwardRef<
  InputRef,
  PhoneInputProps
>((props, ref) => {
  const inputRef = useForwardRef(ref)
  const { t } = useTranslation(['global'])

  const [countryCode, setCountryCode] = useState<string | undefined>()

  const handleInputChange = useCallback((e: OnChangeEvent) => {
    if (props.onChange) {
      props.onChange(e.unmaskedValue)
    }
  }, [])

  const handleMultiOptionPhone = (numberStr: string) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(numberStr)
      setCountryCode(phoneNumber?.country)
    } catch (e) {
      setCountryCode(undefined)
    }
  }

  const handleValueChange = () => {
    if (!props.value) {
      setCountryCode(undefined)
      return
    }

    const numberStr = `+${props.value}`
    const possibleCountries = countries.filter(country =>
      numberStr.startsWith(country.dialCode)
    )

    if (possibleCountries.length > 1) {
      handleMultiOptionPhone(numberStr)
    } else if (possibleCountries.length === 1) {
      setCountryCode(possibleCountries[0].code)
    } else {
      setCountryCode(undefined)
    }
  }

  const handleCountryChange = useCallback(
    (value: string) => {
      const country = CountryList.findOneByCountryCode(value)
      if (!country) {
        return
      }

      setCountryCode(country.code)

      if (!inputRef.current) {
        return
      }

      ;(inputRef.current.input as HTMLInputElement).value = country.dialCode
      inputRef.current.focus()
    },
    [inputRef.current]
  )

  useEffect(handleValueChange, [props.value])

  useEffect(() => {
    if (
      inputRef.current &&
      inputRef.current.input?.value === '' &&
      props.value !== ''
    ) {
      ;(inputRef.current.input as HTMLInputElement).value =
        phoneFormatter.resolve(props.value || '')
    }
  }, [props.value, inputRef.current])

  return (
    <div className={styles.wrapper}>
      <Select
        value={countryCode}
        onChange={handleCountryChange}
        className={styles.select}
        placeholder={t('country')}
        disabled={props.disabled}
      >
        {countries.map(country => (
          <Select.Option key={country.index} value={country.code}>
            <Emojione>{country.flag}</Emojione> {country.name}
          </Select.Option>
        ))}
      </Select>
      <MaskedInput
        {...props}
        ref={inputRef}
        mask={phoneInputMask}
        placeholder={phoneInputMask}
        maskOptions={{
          placeholderChar: 'X',
          lazy: true,
        }}
        value={phoneFormatter.resolve(props.value || '')}
        onChange={handleInputChange}
      />
    </div>
  )
})

export default PhoneInput
