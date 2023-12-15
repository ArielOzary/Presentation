import React, { useMemo } from 'react'

import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { Button, Popconfirm, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'

import { CompanySupplierDto } from 'models'

export const useColumns = (
  deleteSupplier: (record: CompanySupplierDto) => void,
  editSupplier: (record: CompanySupplierDto) => void,
  deleteLoading: boolean
) => {
  const { t, i18n } = useTranslation([
    'clientProfile',
    'adminSignUp',
    'global',
    'signUp',
  ])

  const columns: ColumnsType<CompanySupplierDto> = useMemo(
    () => [
      {
        title: t('adminSignUp:companyName'),
        dataIndex: 'companyName',
        key: 'companyName',
        fixed: 'left',
      },
      {
        title: t('global:name'),
        dataIndex: 'contactName',
        key: 'contactName',
      },
      {
        title: t('global:email'),
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: t('signUp:contactInfo.phoneNumber'),
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        title: t('signUp:contactInfo.phoneNumber'),
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        dataIndex: 'operation',
        key: 'operation',
        align: 'right',
        render: (_, record: CompanySupplierDto) => (
          <Space size="small" wrap>
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => {
                editSupplier(record)
              }}
            />
            <Popconfirm
              title={t('clientProfile:deleteSupplier')}
              description={t('clientProfile:confirmToDeleteSupplier')}
              icon={<QuestionCircleOutlined />}
              onConfirm={() => deleteSupplier(record)}
              okButtonProps={{ loading: deleteLoading }}
            >
              <Button danger ghost icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [i18n.language]
  )

  return { columns }
}
