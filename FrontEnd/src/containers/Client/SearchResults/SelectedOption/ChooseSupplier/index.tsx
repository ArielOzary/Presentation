import React, { useCallback } from 'react'

import { Spin, message } from 'antd'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import useConfig from 'containers/Client/SearchQuote/Specifications/config'

import CustomSelect from './CustomSelect'

import { useCreateShipment, usePostShipmentFile } from 'fetchers'
import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

interface Props {
  setCreateSupplier: (value: boolean) => void
}

const ChooseSupplier: React.FC<Props> = ({ setCreateSupplier }) => {
  const navigate = useNavigate()
  const { t } = useTranslation(['createSupplier', 'shipments'])

  const { mutateData } = useConfig()
  const selectedQuote = useSearchQuoteStore(store => store.selectedQuote)

  const { mutate: createShipment, isLoading: shipmentIsLoading } =
    useCreateShipment()
  const { mutate: addShipmentFile, isLoading: shipmentFilesLoading } =
    usePostShipmentFile()

  const handleSuccess = (id: string) => {
    if (mutateData.quoteGood?.file?.fileList.length) {
      const formData = new FormData()
      // formData.append(
      //   'files',
      //   mutateData.quoteGood?.file?.fileList as unknown as Blob
      // )
      formData.append('shipmentId', id)

      for (const file of mutateData.quoteGood.file.fileList) {
        formData.append('Files', file as unknown as File)
      }

      addShipmentFile(formData)
    }

    message.success(t('shipments:successfullyCreated'))
    navigate('/client/dashboard/active')
  }

  const handleError = useCallback((e: AxiosError) => {
    message.error(e.message)
  }, [])

  const handleSelect = useCallback((value: number) => {
    selectedQuote.rateId &&
      selectedQuote.companyId &&
      createShipment(
        {
          rateId: selectedQuote.rateId,
          companyId: selectedQuote.companyId,
          supplierId: value,
          ...mutateData,
        },
        { onSuccess: handleSuccess, onError: handleError }
      )
  }, [])

  return (
    <>
      <p className={styles.title}>{t('createSupplier:chooseSupplier')}</p>
      {shipmentIsLoading || shipmentFilesLoading ? (
        <Spin />
      ) : (
        <CustomSelect
          setCreateSupplier={setCreateSupplier}
          handleSelect={handleSelect}
        />
      )}
    </>
  )
}

export default ChooseSupplier
