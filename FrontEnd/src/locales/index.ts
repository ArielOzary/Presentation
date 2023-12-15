import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/he'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from './en'
import he from './he'

import { setAcceptLanguageHeader } from 'utils/api'

export const defaultNS = 'global'
export const resources = { en, he } as const

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    ns: Object.keys(en),
    defaultNS,
    resources,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

const applyLocale = (locale?: string) => {
  if (i18n.language !== i18n.resolvedLanguage) {
    i18n.changeLanguage(i18n.resolvedLanguage)
    return
  }

  if (locale) {
    dayjs.locale(locale)
    document.body.setAttribute('dir', i18n.dir(locale))
    setAcceptLanguageHeader(locale)
  }
}

i18n.on('languageChanged', lang => applyLocale(lang))
applyLocale(i18n.resolvedLanguage)
