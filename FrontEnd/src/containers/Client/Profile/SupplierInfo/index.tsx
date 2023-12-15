import React, { useEffect, useState } from 'react'

import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Spin, Table, TablePaginationConfig, message } from 'antd'
import { useTranslation } from 'react-i18next'

import AddSupplier from './AddSupplier'
import EditSupplier from './EditSupplier'
import { useColumns } from './config'

import { useDeleteSupplier, useGetSuppliers } from 'fetchers'
import { CompanySupplierDto } from 'models'
import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

const SupplierInfo: React.FC = () => {
  const { t } = useTranslation(['clientProfile', 'global'])

  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [supplierId, setSupplierId] = useState<number | undefined>(undefined)

  const [isAddingSupplier, isEditing, setIsAddingSupplier, setIsEditing] =
    useProfileStore(store => [
      store.isAddingSupplier,
      store.isEditing,
      store.setIsAddingSupplier,
      store.setIsEditing,
    ])

  const { data, isLoading, refetch } = useGetSuppliers({
    PageNumber: pageNumber,
    PageSize: pageSize,
  })
  const { mutate, isLoading: deleteLoading } = useDeleteSupplier()

  const toggleAdd = () => {
    setIsAddingSupplier(!isAddingSupplier)
  }

  const editSupplier = (record: CompanySupplierDto) => {
    setSupplierId(record.id)
    setIsEditing(true)
  }

  const deleteSupplier = (record: CompanySupplierDto) => {
    record.id &&
      mutate(record.id, {
        onSuccess: () => {
          message.success(t('clientProfile:supplierSuccessfullyDeleted'))
          refetch()
        },
        onError: error => message.error(error.message),
      })
  }

  const { columns } = useColumns(deleteSupplier, editSupplier, deleteLoading)

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) setPageNumber(pagination.current)
    if (pagination.pageSize) setPageSize(pagination.pageSize)
  }
  useEffect(() => setIsEditing(false), [])

  return (
    <>
      {isEditing && <EditSupplier id={supplierId} refetch={refetch} />}
      {isAddingSupplier && <AddSupplier refetch={refetch} />}
      {!isEditing && !isAddingSupplier && (
        <div className={styles.wrapper}>
          <p className={styles.title}>
            {t('clientProfile:supplierTitle')} ({t('clientProfile:supplier')})
            <Button
              size="large"
              type="text"
              icon={
                isAddingSupplier ? (
                  <CloseOutlined className={styles.icon} />
                ) : (
                  <PlusOutlined className={styles.icon} />
                )
              }
              className={styles.editBtn}
              onClick={toggleAdd}
            >
              {isAddingSupplier
                ? t('global:cancel')
                : t('clientProfile:addSupplier')}
            </Button>
          </p>
          <Spin spinning={isLoading}>
            <Table
              columns={columns}
              dataSource={data?.items}
              pagination={{
                current: pageNumber,
                pageSize: pageSize,
                total: data?.totalCount || 0,
                responsive: true,
              }}
              loading={isLoading}
              onChange={handleTableChange}
              scroll={{ x: 'calc(700px + 10%)' }}
            />
          </Spin>
        </div>
      )}
    </>
  )
}

export default SupplierInfo
