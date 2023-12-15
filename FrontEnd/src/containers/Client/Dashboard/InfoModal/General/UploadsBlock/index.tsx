import React, { useCallback, useEffect, useState } from 'react'

import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Divider, Upload, message } from 'antd'
import { RcFile } from 'antd/es/upload'
import cn from 'classnames'
import FileSaver from 'file-saver'
import { useTranslation } from 'react-i18next'

import {
  useDeleteShipmentFile,
  useGetShipmentsFileById,
  usePostShipmentFile,
} from 'fetchers'
import { useShipmentsDashboardStore } from 'stores/shipmentsDashboard'

import styles from './styles.module.scss'

import { ReactComponent as ImgSvg } from 'assets/images/img.svg'

interface Props {
  refetch: () => void
}

const UploadsBlock: React.FC<Props> = ({ refetch }) => {
  const { t } = useTranslation(['clientDashboard', 'createSupplier', 'newRate'])

  const shipment = useShipmentsDashboardStore(store => store.shipment)

  const [file, setFile] = useState<RcFile>()
  const [fileId, setFileId] = useState<string>('')

  const { mutate: putFile } = usePostShipmentFile()
  const { mutate: deleteFile } = useDeleteShipmentFile()
  const { data, isSuccess } = useGetShipmentsFileById(fileId, {
    enabled: Boolean(fileId),
  })

  const handleRemove = (
    id: string | undefined,
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation()

    if (!id) return

    deleteFile(id, {
      onSuccess: () => {
        refetch()
        message.info(t('clientDashboard:fileSuccessfullyDeleted'))
      },
    })
  }

  const handleBeforeUpload = useCallback((file: RcFile) => {
    setFile(file)

    return false
  }, [])

  const uploadFiles = useCallback(() => {
    if (file && shipment.id) {
      const formData = new FormData()
      formData.append('files', file as RcFile)
      formData.append('shipmentId', shipment.id)

      putFile(formData, {
        onSuccess: () => {
          refetch()
          message.success(t('clientDashboard:fileSuccessfullyAdded'))
        },
      })
    }
  }, [file, shipment.id])

  const handleDownloadFile = (id: string | undefined) => {
    if (!id) return
    setFileId(id)
  }

  useEffect(() => {
    if (isSuccess) {
      // FileSaver.saveAs(data.link || '', data.name)
      fetch(data.link as string)
        .then(res => res.blob())
        .then(blob => FileSaver.saveAs(blob, data.name))

      setFileId('')
    }
  }, [isSuccess])

  return (
    <>
      <div
        className={cn(
          styles.uploadBlock,
          !shipment.containerNumberOrVesselName && styles.margin
        )}
      >
        <span className={styles.title}>{t('clientDashboard:myUploads')}</span>
        <div>
          <span>
            <strong>{t('createSupplier:upload')}</strong> (
            {t('newRate:optional')}) :{' '}
          </span>
          <Upload
            listType="picture"
            fileList={[]}
            beforeUpload={handleBeforeUpload}
            onChange={uploadFiles}
          >
            <Button icon={<UploadOutlined />} className={styles.uploadBtn}>
              {t('createSupplier:click')}
            </Button>
          </Upload>
        </div>
        <div className={styles.fileList}>
          {shipment.myFiles?.map(file => (
            <Button
              key={file.id}
              className={cn(styles.file, styles.editable)}
              onClick={() => handleDownloadFile(file.id)}
            >
              <div>
                <div className={styles.wpIcon}>
                  <ImgSvg />
                </div>
                <span className={styles.fileName}>{file.name}</span>
                <div className={styles.wrapperDeleteIcon}>
                  <DeleteOutlined onClick={e => handleRemove(file.id, e)} />
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {shipment.otherFiles?.length ? (
        <>
          <Divider className={styles.divider} />
          <div className={styles.otherFiles}>
            <span className={styles.title}>
              {t('clientDashboard:freightForwarderFiles')}
            </span>
            <div className={styles.fileList}>
              {shipment.otherFiles?.map(file => (
                <Button
                  key={file.id}
                  className={styles.file}
                  onClick={() => handleDownloadFile(file.id)}
                >
                  <ImgSvg />
                  {file.name}
                </Button>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}

export default UploadsBlock
