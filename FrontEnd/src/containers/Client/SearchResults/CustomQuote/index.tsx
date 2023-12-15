import React, { useCallback, useEffect, useState } from 'react'

import { UploadOutlined } from '@ant-design/icons'
import { Alert, Button, Checkbox, Input, Spin, Upload, message } from 'antd'
import { CheckboxOptionType, CheckboxValueType } from 'antd/es/checkbox/Group'
import { UploadFile } from 'antd/es/upload'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'

import Scrollbars from 'components/Scrollbars'

import { useGetProviders } from 'containers/Client/Dashboard/SideBar/Filters/config'
import useConfig from 'containers/Client/SearchQuote/Specifications/config'

import { usePostCustomQuote, usePostQuoteFiles } from 'fetchers'
import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

import { ReactComponent as DeliveryIcon } from 'assets/delivery.svg'

const CheckboxGroup = Checkbox.Group

const CustomQuote = () => {
  const { t } = useTranslation([
    'quote',
    'clientDashboard',
    'signUp',
    'createSupplier',
    'newRate',
  ])
  const { ref, inView } = useInView()
  const navigate = useNavigate()

  const { mutate, isLoading: quoteLoading } = usePostCustomQuote()
  const { mutate: postFiles, isLoading: filesLoading } = usePostQuoteFiles()

  const { mutateData } = useConfig()
  const setDefault = useSearchQuoteStore(store => store.setDefault)

  const {
    providers,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  } = useGetProviders()

  const [options, setOptions] = useState<CheckboxOptionType[] | undefined>()
  const [checkedList, setCheckedList] = useState<number[]>([])
  const [checkAll, setCheckAll] = useState<boolean>(false)
  const [commentValue, setCommentValue] = useState<string | undefined>(
    undefined
  )
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [infoNeeded, setInfoNeeded] = useState<boolean>(false)

  const onCheckAllChange = () => {
    if (checkAll) {
      setCheckedList([])
      setCheckAll(false)
    } else {
      const list = options?.map(option => option.value)
      list && setCheckedList(list as number[])
      setCheckAll(true)
    }
  }

  const onCheckboxChange = (list: CheckboxValueType[]) => {
    setCheckedList(list as number[])
    if (options?.length === list.length) {
      setCheckAll(true)
    } else {
      setCheckAll(false)
    }
  }

  const onCommentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCommentValue(e.target.value)
  }

  const handleBeforeUpload = (file: UploadFile) => {
    setFileList([...fileList, file])

    return false
  }

  const handleRemove = (file: UploadFile) => {
    const index = fileList.indexOf(file)
    const newFileList = fileList.slice()
    newFileList.splice(index, 1)
    setFileList(newFileList)
  }

  const handleSuccess = (data: number[]) => {
    if (fileList.length > 0) {
      const promiseData = data.map(id => {
        const formData = new FormData()

        formData.append('QuoteId', String(id))
        for (const file of fileList) {
          formData.append('Files', file as unknown as File)
        }

        postFiles(formData, {
          onError: error => message.error(error.message),
        })
      })

      Promise.all(promiseData)
    }
    message.success(t('quote:successfullyCreatedCustomQuote'))
    setDefault()
    navigate('/client/search-quote')
  }

  const handleRequestQuote = useCallback(() => {
    if (checkedList.length && mutateData) {
      setInfoNeeded(false)
      mutate(
        { companyIds: checkedList, remarks: commentValue, ...mutateData },

        {
          onSuccess: handleSuccess,
          onError: error => message.error(error.message),
        }
      )
    } else setInfoNeeded(true)
  }, [checkedList, mutateData, fileList])

  useEffect(() => {
    setOptions(providers())
  }, [isFetchingNextPage])

  useEffect(() => {
    if (inView && hasNextPage && fetchNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  return (
    <div>
      <div className={styles.hero}>
        <div className={styles.content}>
          <DeliveryIcon className={styles.icon} />
          <div className={styles.textBlock}>
            <p className={styles.title}>{t('quote:customQuote')}</p>
            <p className={styles.text}>
              <span className={styles.firstText}>
                {t('quote:heroText.findNoResults')}
              </span>
              {t('quote:heroText.selectSellers')}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.titleBlock}>
          <span className={styles.title}>{t('quote:sellers')}</span>
          <button className={styles.all} onClick={onCheckAllChange}>
            {t('clientDashboard:selectAll')}
          </button>
        </div>
        {infoNeeded && (
          <Alert
            type="error"
            message={t('quote:selectSellers')}
            className={styles.alert}
          />
        )}
        <div className={styles.list}>
          <Scrollbars>
            <CheckboxGroup
              options={options}
              value={checkedList}
              onChange={onCheckboxChange}
              className={styles.group}
            />
            {hasNextPage && (
              <div ref={ref}>
                <Spin spinning={isFetchingNextPage} />{' '}
              </div>
            )}
          </Scrollbars>
        </div>

        <span className={styles.title}>
          {t('signUp:companyLocation.comments')}
        </span>
        <Input.TextArea
          showCount
          maxLength={100}
          placeholder={t('quote:commentPlaceholder')}
          value={commentValue}
          onChange={onCommentChange}
          className={styles.comment}
        />
        <div className={styles.uploadBlock}>
          <span>
            <strong>{t('createSupplier:upload')}</strong> (
            {t('newRate:optional')}) :{' '}
          </span>
          <Upload
            listType="picture"
            fileList={fileList}
            beforeUpload={handleBeforeUpload}
            onRemove={handleRemove}
          >
            <Button icon={<UploadOutlined />} className={styles.uploadBtn}>
              {t('createSupplier:click')}
            </Button>
          </Upload>
        </div>
        <Button
          type="primary"
          size="large"
          className={styles.btn}
          onClick={handleRequestQuote}
          loading={filesLoading || quoteLoading}
        >
          {t('quote:requestCustomQuotes')}
        </Button>
      </div>
    </div>
  )
}

export default CustomQuote
