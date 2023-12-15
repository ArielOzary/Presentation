import React, { useState } from 'react'

import { CloseOutlined } from '@ant-design/icons'
import { Button, UploadFile, message } from 'antd'
import { useTranslation } from 'react-i18next'

import FormSupplier from '../FormSupplier'
import { CombinedSupplierSchemaType } from '../hooks/editSupplierForm'

import { usePostSupplier, usePostSupplierFile } from 'fetchers'
import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

interface Props {
  refetch: () => void
}

const AddSupplier: React.FC<Props> = ({ refetch }) => {
  const { t } = useTranslation([
    'clientProfile',
    'adminSignUp',
    'signUp',
    'createSupplier',
    'global',
    'supplier',
  ])

  const setIsAddingSupplier = useProfileStore(
    store => store.setIsAddingSupplier
  )

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const { mutate, isLoading: mutateSupplier } = usePostSupplier()
  const { mutate: postFiles, isLoading: mutateFiles } = usePostSupplierFile()

  const loading = mutateSupplier || mutateFiles

  const handleCancel = () => {
    setIsAddingSupplier(false)
  }

  const handleSupplierSuccess = (id: number) => {
    if (fileList.length) {
      const formData = new FormData()

      formData.append('SupplierId', id as unknown as Blob)

      for (const file of fileList) {
        formData.append('Files', file as unknown as File)
      }

      postFiles(formData, {
        onSuccess: () => {
          message.success(t('supplier:successfullyCreated'))
          setIsAddingSupplier(false)
          refetch()
        },
        onError: error => message.error(error.message),
      })
    } else {
      message.success(t('supplier:successfullyCreated'))
      setIsAddingSupplier(false)
      refetch()
    }
  }

  const handleForm = (data: CombinedSupplierSchemaType) => {
    mutate(data, {
      onSuccess: handleSupplierSuccess,
      onError: error => message.error(error.message),
    })
  }

  return (
    <div className={styles.wrapper}>
      <Button
        size="large"
        type="text"
        icon={<CloseOutlined className={styles.icon} />}
        className={styles.editBtn}
        onClick={handleCancel}
      >
        {t('global:cancel')}
      </Button>
      <p className={styles.title}>
        {t('clientProfile:supplierTitle')} ({t('clientProfile:supplier')})
      </p>
      <FormSupplier
        fileList={fileList}
        setFileList={setFileList}
        handleForm={handleForm}
        loading={loading}
      />
    </div>
  )
}

export default AddSupplier
