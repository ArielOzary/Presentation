import React, { useEffect } from 'react'

import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, UploadFile } from 'antd'
import { RcFile } from 'antd/es/upload'
import cn from 'classnames'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormEmailRow from 'components/AuthorizationWrapper/FormEmailRow'
import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'
import { useTextAreaControl } from 'components/FormControls/hooks/textAreaControl'
import useUploadInputControl from 'components/FormControls/hooks/uploadInputControl'

import {
  CombinedSupplierSchemaType,
  useCombinedSupplierForm,
} from '../hooks/editSupplierForm'

import { CompanySupplierDetailDto } from 'models'
import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

interface Props {
  fileList: UploadFile[]
  loading: boolean
  setFileList: (value: UploadFile[]) => void
  handleForm: (data: CombinedSupplierSchemaType) => void
  data?: CompanySupplierDetailDto
  deleteId?: string[]
  setDeleteId?: (value: string[]) => void
}

const FormSupplier: React.FC<Props> = ({
  fileList,
  loading,
  setFileList,
  handleForm,
  data,
  deleteId,
  setDeleteId,
}) => {
  const { t } = useTranslation([
    'clientProfile',
    'adminSignUp',
    'signUp',
    'createSupplier',
    'global',
    'supplier',
  ])

  const isEditing = useProfileStore(store => store.isEditing)

  const { control, formState, reset, handleSubmit } = useCombinedSupplierForm()

  const { renderInputControl } = useInputControl<CombinedSupplierSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<CombinedSupplierSchemaType>()
  const { renderTextAreaControl } =
    useTextAreaControl<CombinedSupplierSchemaType>()
  const { renderUploadInputControl } =
    useUploadInputControl<CombinedSupplierSchemaType>()

  const handleRemove = (file: UploadFile) => {
    const index = fileList.indexOf(file)
    const newFileList = fileList.slice()
    newFileList.splice(index, 1)
    setFileList(newFileList)

    if ('id' in file && setDeleteId && deleteId) {
      setDeleteId([...deleteId, file.id as string])
    }
  }

  const handleBeforeUpload = (file: RcFile) => {
    setFileList([...fileList, file])

    return false
  }

  useEffect(() => {
    data && reset(data)
  }, [data, isEditing])

  return (
    <Form
      onSubmitCapture={handleSubmit(handleForm)}
      layout="vertical"
      size="large"
      className={styles.form}
    >
      <div className={styles.companyBlock}>
        <FormRow>
          <Controller
            control={control}
            name="companyName"
            render={renderInputControl(
              { label: t('adminSignUp:companyName') },
              { placeholder: t('adminSignUp:companyName') }
            )}
          />
          <Controller
            control={control}
            name="companyPhoneNumber"
            render={renderInputPhoneControl({
              label: t('signUp:contactInfo.phoneNumber'),
            })}
          />
        </FormRow>
        <FormEmailRow>
          <Controller
            control={control}
            name="companyAddress"
            render={renderInputControl(
              { label: t('signUp:companyLocation.mailingAddress') },
              { placeholder: 'Shpigelman 16, Netanya' }
            )}
          />
          <Controller
            control={control}
            name="companyApartment"
            render={renderInputControl(
              { label: t('signUp:companyLocation.apartment') },
              { placeholder: '5', maxLength: 5 }
            )}
          />
          <Controller
            control={control}
            name="companyPostalCode"
            render={renderInputControl(
              { label: t('signUp:companyLocation.postalCode') },
              { placeholder: '40300', maxLength: 5 }
            )}
          />
        </FormEmailRow>
      </div>
      <p className={styles.title}>{t('clientProfile:supplierTitle')}</p>
      <FormRow>
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
                <Button icon={<UploadOutlined />}>
                  {t('createSupplier:click')}
                </Button>
              ),
            }
          )}
        />
      </div>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={formState.isValidating || loading}
          size="large"
          className={cn(styles.btn, 'bold')}
        >
          {t('global:saveChanges')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default FormSupplier
