import React, { useCallback, useEffect, useState } from 'react'

import { Button, List, Pagination, Spin, message } from 'antd'
import cn from 'classnames'
import FileSaver from 'file-saver'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import QuoteSteps from './QuoteSteps'

import { useGetQuotesFileById } from 'fetchers'
import { useGetClientCustomQuote } from 'fetchers/clients/getCustomQuote'
import { ClientCustomQuoteDto } from 'models'
import { useFreightForwarderClientsStore } from 'stores/freightForwarderClients'

import styles from './styles.module.scss'

import { ReactComponent as ImgSvg } from 'assets/images/img.svg'

const PendingQuotes: React.FC = () => {
  const { t } = useTranslation(['ffClients', 'searchQuote', 'signUp'])
  const { id } = useParams()
  const navigate = useNavigate()

  const setCustomQuote = useFreightForwarderClientsStore(
    store => store.setCustomQuote
  )

  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number | undefined>(0)
  const [quotes, setQuotes] = useState<ClientCustomQuoteDto[] | undefined>(
    undefined
  )
  const [fileId, setFileId] = useState<string>('')

  const { data, isLoading } = useGetClientCustomQuote(
    { id, PageNumber: pageNumber, PageSize: pageSize },
    {
      enabled: Boolean(id),
    }
  )
  const {
    data: downloadFile,
    isSuccess,
    isError,
    error,
  } = useGetQuotesFileById(fileId, {
    enabled: Boolean(fileId),
  })

  const onAddRates = useCallback((item: ClientCustomQuoteDto) => {
    setCustomQuote(item)
    navigate('/rate')
  }, [])

  const handleDownloadFile = (id: string | undefined) => {
    if (!id) return
    setFileId(id)
  }

  const renderList = useCallback((item: ClientCustomQuoteDto) => {
    return (
      <List.Item className={styles.item} key={item.id}>
        <QuoteSteps item={item} />
        {item.remarks ? (
          <div className={styles.remarks}>
            <span>{t('signUp:companyLocation.comments')}:</span>
            <p className={styles.text}>{item.remarks}</p>
          </div>
        ) : null}
        {item.files?.length
          ? item.files.map(file => (
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
                </div>
              </Button>
            ))
          : null}
        <Button
          type="primary"
          size="large"
          className={styles.btn}
          onClick={() => onAddRates(item)}
        >
          {t('ffClients:addRates')}
        </Button>
      </List.Item>
    )
  }, [])

  const handlePaginationChange = useCallback(
    (page: number, pageSize: number) => {
      setPageSize(pageSize)
      setPageNumber(page)
    },
    []
  )

  useEffect(() => {
    if (data) {
      setQuotes(data.items)
      setTotalCount(data.totalCount)
    }
  }, [data])

  useEffect(() => {
    if (isSuccess) {
      fetch(downloadFile.link as string)
        .then(res => res.blob())
        .then(blob => FileSaver.saveAs(blob, downloadFile.name))

      setFileId('')
    }
    if (isError) {
      message.error(error.message)
    }
  }, [isSuccess, isError, error])

  return (
    <div>
      <p className={styles.title}>{t('ffClients:pendingRequestForQuote')}</p>
      <Spin spinning={isLoading}>
        <List
          dataSource={quotes || []}
          renderItem={renderList}
          className={styles.list}
        />
        <Pagination
          showSizeChanger
          hideOnSinglePage
          current={pageNumber}
          pageSize={pageSize}
          total={totalCount}
          onChange={handlePaginationChange}
          className={styles.pagination}
          responsive
        />
      </Spin>
    </div>
  )
}

export default PendingQuotes
