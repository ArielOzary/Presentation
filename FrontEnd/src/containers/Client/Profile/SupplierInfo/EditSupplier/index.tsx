import React, { useEffect, useState } from 'react'

import { Spin, UploadFile, message } from 'antd'
import { useTranslation } from 'react-i18next'

import Wrapper from 'containers/FreightForwarder/Profile/Wrapper'

import FormSupplier from '../FormSupplier'
import { CombinedSupplierSchemaType } from '../hooks/editSupplierForm'

import {
  useGetSupplierById,
  usePostSupplierFile,
  usePutSupplier,
} from 'fetchers'
import { useDeleteSupplierFile } from 'fetchers/supplier/deleteSupplierFiles'
import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

interface Props {
  id: number | undefined
  refetch: () => void
}

const EditSupplier: React.FC<Props> = ({ id, refetch }) => {
  const { t } = useTranslation([
    'clientProfile',
    'adminSignUp',
    'signUp',
    'createSupplier',
    'global',
  ])

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [deleteId, setDeleteId] = useState<string[]>([])

  const [isEditing, setIsEditing] = useProfileStore(store => [
    store.isEditing,
    store.setIsEditing,
  ])

  const { data, isLoading } = useGetSupplierById(id || 0, {
    enabled: Boolean(id),
  })
  const { mutate: updateSupplier, isLoading: loadingUpdate } = usePutSupplier()
  const { mutate: postFiles, isLoading: mutateFiles } = usePostSupplierFile()
  const { mutate: deleteFile } = useDeleteSupplierFile()
  const loading = loadingUpdate || mutateFiles

  const handleForm = (data: CombinedSupplierSchemaType) => {
    if (fileList.length) {
      const formData = new FormData()

      formData.append('SupplierId', id as unknown as Blob)

      for (const file of fileList) {
        formData.append('Files', file as unknown as File)
      }

      postFiles(formData, {
        onError: error => message.error(error.message),
      })
    }
    if (deleteId.length) {
      const promiseData = deleteId.map(id =>
        deleteFile(id, {
          onError: error => message.error(error.message),
        })
      )
      Promise.all(promiseData)
    }
    delete data.file
    id &&
      updateSupplier(
        { id, ...data },
        {
          onSuccess: () => {
            message.success(t('clientProfile:supplierSuccessfullyUpdated'))
            setFileList([])
            setIsEditing(false)
            refetch()
          },
          onError: error => message.error(error.message),
        }
      )
  }

  useEffect(() => {
    setFileList(data?.files as UploadFile[])
  }, [data, isEditing])

  return (
    <Wrapper>
      <p className={styles.title}>
        {t('clientProfile:supplierTitle')} ({t('clientProfile:supplier')})
      </p>
      <Spin spinning={isLoading}>
        <FormSupplier
          fileList={fileList}
          setFileList={setFileList}
          handleForm={handleForm}
          loading={loading}
          data={data}
          deleteId={deleteId}
          setDeleteId={setDeleteId}
        />
        {/* <Form
            onSubmitCapture={handleSubmit(handleForm)}
          layout="vertical"
          size="large"
          className={styles.form}
        >
          <div className={styles.companyBlock}>
            <FormRow>
              {!isEditing ? (
                <div className={styles.fieldBlock}>
                  <span className={styles.label}>
                    {t('adminSignUp:companyName')}
                  </span>
                  <span className={styles.field}>{data?.companyName}</span>
                </div>
              ) : (
                <Controller
                  control={control}
                  name="companyName"
                  render={renderInputControl(
                    { label: t('adminSignUp:companyName') },
                    { placeholder: t('adminSignUp:companyName') }
                  )}
                />
              )}
              {!isEditing ? (
                <div className={styles.fieldBlock}>
                  <span className={styles.label}>
                    {t('adminSignUp:companyName')}
                  </span>
                  <span className={styles.field}>{data?.companyName}</span>
                </div>
              ) : (
                <Controller
                  control={control}
                  name="companyPhoneNumber"
                  render={renderInputPhoneControl({
                    label: t('signUp:contactInfo.phoneNumber'),
                  })}
                />
              )}
            </FormRow>
            <FormEmailRow>
              {!isEditing ? (
                <div className={styles.fieldBlock}>
                  <span className={styles.label}>
                    {t('signUp:companyLocation.mailingAddress')}
                  </span>
                  <span className={styles.field}>{data?.companyAddress}</span>
                </div>
              ) : (
                <Controller
                  control={control}
                  name="companyAddress"
                  render={renderInputControl(
                    { label: t('signUp:companyLocation.mailingAddress') },
                    { placeholder: 'Shpigelman 16, Netanya' }
                  )}
                />
              )}
              {!isEditing ? (
                <div className={styles.fieldBlock}>
                  <span className={styles.label}>
                    {t('signUp:companyLocation.apartment')}
                  </span>
                  <span className={styles.field}>{data?.companyApartment}</span>
                </div>
              ) : (
                <Controller
                  control={control}
                  name="companyApartment"
                  render={renderInputControl(
                    { label: t('signUp:companyLocation.apartment') },
                    { placeholder: '5', maxLength: 5 }
                  )}
                />
              )}
              {!isEditing ? (
                <div className={styles.fieldBlock}>
                  <span className={styles.label}>
                    {t('signUp:companyLocation.postalCode')}
                  </span>
                  <span className={styles.field}>
                    {data?.companyPostalCode}
                  </span>
                </div>
              ) : (
                <Controller
                  control={control}
                  name="companyPostalCode"
                  render={renderInputControl(
                    { label: t('signUp:companyLocation.postalCode') },
                    { placeholder: '40300', maxLength: 5 }
                  )}
                />
              )}
            </FormEmailRow>
          </div>
          <p className={styles.title}>{t('clientProfile:supplierTitle')}</p>
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('global:name')} ({t('clientProfile:supplierTitle')})
                </span>
                <span className={styles.field}>{data?.contactName}</span>
              </div>
            ) : (
              <Controller
                control={control}
                name="contactName"
                render={renderInputControl(
                  {
                    label: `${t('global:name')} (${t(
                      'clientProfile:supplierTitle'
                    )})`,
                  },
                  { placeholder: 'John Doe' }
                )}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:contactInfo.phoneNumber')}
                </span>
                <PhoneNumber
                  number={data?.phoneNumber}
                  className={styles.field}
                />
              </div>
            ) : (
              <Controller
                control={control}
                name="phoneNumber"
                render={renderInputPhoneControl({
                  label: t('signUp:contactInfo.phoneNumber'),
                })}
              />
            )}
          </FormRow>
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:contactInfo.contactEmail')}
                </span>
                <span className={styles.field}>{data?.email}</span>
              </div>
            ) : (
              <Controller
                control={control}
                name="email"
                render={renderInputControl(
                  { label: t('signUp:contactInfo.contactEmail') },
                  { placeholder: 'johndoe@gmail.com' }
                )}
              />
            )}
            <div />
          </FormRow>
          {!isEditing ? (
            <div className={styles.fieldBlock}>
              <span className={styles.label}>
                {t('signUp:companyLocation.comments')}
              </span>
              <span className={styles.field}>{data?.comments}</span>
            </div>
          ) : (
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
          )}
          <div className={styles.upload}>
            {!isEditing ? (
              fileList.map(file => (
                <div
                  className={styles.file}
                    className={cn(styles.file, styles.editable)}
                  key={file.fileName}
                >
                  <div className={styles.wpIcon}>
                    <ImgSvg />
                  </div>
                  <span className={styles.fileName}>{file.name}</span>
                  <div className={styles.wrapperDeleteIcon}>
                    <DeleteOutlined onClick={e => handleRemove(file.id, e)} />
                  </div>
                </div>
              ))
            ) : (
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
            )}
          </div>
          {isEditing ? (
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={formState.isValidating}
                size="large"
                className={cn(styles.btn, 'bold')}
              >
                {t('global:saveChanges')}
              </Button>
            </Form.Item>
          ) : null}
        </Form> */}
      </Spin>
    </Wrapper>
  )
}

export default EditSupplier
