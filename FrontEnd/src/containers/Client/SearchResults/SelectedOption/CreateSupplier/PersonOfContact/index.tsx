import React, { useState } from 'react'

import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Spin, message } from 'antd'
import { RcFile, UploadFile } from 'antd/lib/upload/interface'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'
import { useTextAreaControl } from 'components/FormControls/hooks/textAreaControl'
import useUploadInputControl from 'components/FormControls/hooks/uploadInputControl'

import useConfig from 'containers/Client/SearchQuote/Specifications/config'

import {
  ContactPersonInfoSchemaType,
  useContactPersonInfoForm,
} from './hooks/personOfContactForm'

import {
  useCreateShipment,
  usePostShipmentFile,
  usePostSupplier,
  usePostSupplierFile,
} from 'fetchers'
import { useSearchQuoteStore } from 'stores/searchQuote'
import { useSupplierStore } from 'stores/suppliers'

import styles from './styles.module.scss'

const PersonOfContact: React.FC = () => {
  const { t } = useTranslation([
    'signUp',
    'createSupplier',
    'shipments',
    'supplier',
  ])
  const navigate = useNavigate()

  const { control, formState, handleSubmit } = useContactPersonInfoForm()

  const { renderInputControl } = useInputControl<ContactPersonInfoSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<ContactPersonInfoSchemaType>()
  const { renderTextAreaControl } =
    useTextAreaControl<ContactPersonInfoSchemaType>()
  const { renderUploadInputControl } =
    useUploadInputControl<ContactPersonInfoSchemaType>()

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const companyInfo = useSupplierStore(store => store.companyInfo)
  const selectedQuote = useSearchQuoteStore(store => store.selectedQuote)

  const { mutateData } = useConfig()

  const { mutate, isLoading } = usePostSupplier()
  const { mutate: addSupplierFiles, isLoading: supplierFilesLoading } =
    usePostSupplierFile()
  const { mutate: createShipment, isLoading: shipmentLoading } =
    useCreateShipment()
  const { mutate: addShipmentFile, isLoading: shipmentFilesLoading } =
    usePostShipmentFile()

  const handleRemove = (file: UploadFile) => {
    const index = fileList.indexOf(file)
    const newFileList = fileList.slice()
    newFileList.splice(index, 1)
    setFileList(newFileList)
  }

  const handleBeforeUpload = (file: RcFile) => {
    setFileList([...fileList, file])

    return false
  }

  const handleShipmentSuccess = (id: string) => {
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

      addShipmentFile(formData, {
        onSuccess: () => {
          message.success(t('shipments:successfullyCreated'))
          navigate('/client/dashboard/active')
        },
        onError: error => message.error(error.message),
      })
    } else {
      message.success(t('shipments:successfullyCreated'))
      navigate('/client/dashboard/active')
    }
  }

  const handleSupplierSuccess = (id: number) => {
    if (fileList.length) {
      const formData = new FormData()

      formData.append('SupplierId', id as unknown as Blob)

      for (const file of fileList) {
        formData.append('Files', file as unknown as File)
      }

      addSupplierFiles(formData, {
        onSuccess: () => {
          message.success(t('supplier:successfullyCreated'))

          selectedQuote.rateId &&
            selectedQuote.companyId &&
            createShipment(
              {
                rateId: selectedQuote.rateId,
                companyId: selectedQuote.companyId,
                supplierId: id,
                ...mutateData,
              },
              { onSuccess: handleShipmentSuccess }
            )
        },
        onError: error => message.error(error.message),
      })
    } else {
      message.success(t('supplier:successfullyCreated'))

      selectedQuote.rateId &&
        selectedQuote.companyId &&
        createShipment(
          {
            rateId: selectedQuote.rateId,
            companyId: selectedQuote.companyId,
            supplierId: id,
            ...mutateData,
          },
          { onSuccess: handleShipmentSuccess }
        )
    }
  }

  const handleForm = (values: ContactPersonInfoSchemaType) => {
    if (companyInfo) {
      const dto = { ...companyInfo, ...values }

      mutate(dto, {
        onSuccess: handleSupplierSuccess,
      })
    }
  }

  return (
    <div>
      <span className={styles.title}>{t('createSupplier:contactPerson')}</span>
      {isLoading ||
      supplierFilesLoading ||
      shipmentLoading ||
      shipmentFilesLoading ? (
        <Spin />
      ) : (
        <Form
          onSubmitCapture={handleSubmit(handleForm)}
          layout="vertical"
          size="large"
          className={styles.form}
        >
          <FormRow>
            <Controller
              control={control}
              name="contactName"
              render={renderInputControl(
                { label: t('signUp:contactInfo.contactName') },
                { placeholder: 'John Doe' }
              )}
            />
            <Controller
              control={control}
              name="phoneNumber"
              render={renderInputPhoneControl({
                label: t('signUp:contactInfo.phoneNumber'),
              })}
            />
          </FormRow>
          <FormRow>
            <Controller
              control={control}
              name="email"
              render={renderInputControl(
                { label: t('signUp:contactInfo.contactEmail') },
                { placeholder: 'johndoe@gmail.com' }
              )}
            />
            <div />
          </FormRow>
          <Controller
            control={control}
            name="comments"
            render={renderTextAreaControl(
              { label: t('signUp:companyLocation.comments') },
              {
                autoSize: { minRows: 2, maxRows: 6 },
                maxLength: 100,
                showCount: true,
              }
            )}
          />
          <div className={styles.upload}>
            <Controller
              name="file"
              control={control}
              render={renderUploadInputControl(
                {
                  label: <strong>{t('createSupplier:upload')}</strong>,
                },
                {
                  listType: 'picture',
                  fileList,
                  beforeUpload: handleBeforeUpload,
                  onRemove: handleRemove,
                  children: (
                    <Button
                      icon={<UploadOutlined />}
                      className={styles.uploadBtn}
                    >
                      {t('createSupplier:click')}
                    </Button>
                  ),
                }
              )}
            />
          </div>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              loading={formState.isValidating}
            >
              {t('createSupplier:openShipment')}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  )
}

export default PersonOfContact
