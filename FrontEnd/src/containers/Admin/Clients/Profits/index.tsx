import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { EditOutlined } from '@ant-design/icons'
import { Button, Card, Form, Spin, message } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'

import { ProfitsSchemaType, useProfitsForm } from './hooks/profitsForm'

import {
  useGetClientProfits,
  useGetUserById,
  usePutClientProfits,
} from 'fetchers'
import { UserVerificationStatus } from 'models'

import { handleKeyPress } from 'utils/handleKeyPress'

import styles from './styles.module.scss'

interface Props {
  refetchList: () => void
}

const Profits: React.FC<Props> = ({ refetchList }) => {
  const { t } = useTranslation(['global', 'clientsProfit'])
  const params = useParams<{ id: string }>()

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const { control, handleSubmit, reset } = useProfitsForm({})
  const { renderInputControl } = useInputControl<ProfitsSchemaType>()

  const {
    data: profits,
    isLoading: isProfitsLoading,
    refetch: refetchProfits,
  } = useGetClientProfits(
    { id: params.id || '' },
    {
      enabled: Boolean(params.id),
    }
  )
  const {
    data: user,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useGetUserById(params.id || '', {
    enabled: Boolean(params.id),
  })

  const { mutate, isLoading: isUpdateLoading } = usePutClientProfits()

  const handleToggleEdit = useCallback(() => {
    setIsEditing(isEditing => !isEditing)
  }, [])

  const handleSuccess = () => {
    refetchUser()
    refetchProfits()
    refetchList()
    setIsEditing(false)

    message.success(t('clientsProfit:profitsUpdated'))
  }

  const handleForm = (dto: ProfitsSchemaType) => {
    if (!params.id) {
      return
    }

    mutate({ id: params.id, dto }, { onSuccess: handleSuccess })
  }

  useEffect(() => {
    reset(profits)
  }, [profits])

  const isLoading = useMemo(
    () => isUserLoading || isProfitsLoading || isUpdateLoading,
    [isUserLoading, isProfitsLoading, isUpdateLoading]
  )

  return (
    <Spin spinning={isLoading}>
      <Card>
        <div className={styles.header}>
          <span className={styles.title}>
            {t('clientsProfit:travelProfits')}
          </span>
          {user?.status !== UserVerificationStatus.Rejected && (
            <Button
              onClick={handleToggleEdit}
              className={styles.editToggleBtn}
              icon={<EditOutlined />}
              size="large"
              type="text"
            />
          )}
        </div>
        <Form
          layout="vertical"
          onFinish={handleSubmit(handleForm)}
          disabled={!isEditing}
        >
          <FormRow>
            <Controller
              control={control}
              name="lcl"
              render={renderInputControl(
                { label: t('clientsProfit:lclProfit') },
                { placeholder: '0', suffix: '$', onKeyPress: handleKeyPress }
              )}
            />
            <Controller
              control={control}
              name="fcl"
              render={renderInputControl(
                { label: t('clientsProfit:fclProfit') },
                { placeholder: '0', suffix: '$', onKeyPress: handleKeyPress }
              )}
            />
          </FormRow>
          <FormRow>
            <Controller
              control={control}
              name="air"
              render={renderInputControl(
                { label: t('clientsProfit:airProfit') },
                { placeholder: '0', suffix: '$', onKeyPress: handleKeyPress }
              )}
            />
          </FormRow>
          <Form.Item className={styles.subTitle}>
            <span className={styles.title}>
              {t('clientsProfit:otherCharges')}
            </span>
          </Form.Item>
          <FormRow>
            <Controller
              control={control}
              name="customClearance"
              render={renderInputControl(
                { label: t('clientsProfit:customClearance') },
                { placeholder: '0', suffix: '$', onKeyPress: handleKeyPress }
              )}
            />
            <Controller
              control={control}
              name="originCharges"
              render={renderInputControl(
                { label: t('clientsProfit:originChargesProfit') },
                { placeholder: '0', suffix: '$', onKeyPress: handleKeyPress }
              )}
            />
          </FormRow>
          <FormRow>
            <Controller
              control={control}
              name="destinationCharges"
              render={renderInputControl(
                { label: t('clientsProfit:destinationProfit') },
                { placeholder: '0', suffix: '$', onKeyPress: handleKeyPress }
              )}
            />
          </FormRow>
          {isEditing && (
            <Form.Item className={styles.btnsBlock}>
              <div className={styles.btns}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  className="bold"
                  size="large"
                >
                  {t('global:saveChanges')}
                </Button>
              </div>
            </Form.Item>
          )}
        </Form>
      </Card>
    </Spin>
  )
}

export default Profits
