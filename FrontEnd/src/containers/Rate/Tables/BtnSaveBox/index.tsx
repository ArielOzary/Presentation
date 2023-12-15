import React, { useCallback } from 'react'

import { Button, Popconfirm } from 'antd'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useSaveRate } from 'containers/Rate/_hooks/saveRate'

import { useRateStore } from 'stores/rate'

const BtnSaveBox: React.FC = () => {
  const { t } = useTranslation(['global', 'newRate'])
  const { id } = useParams<{ id: string }>()
  const isDraft = useRateStore(({ rate }) => rate.isDraft)
  const { saveRate, isLoading } = useSaveRate(id)

  const handleSaveDraft = useCallback(() => {
    saveRate(true)
  }, [])

  const handleSave = useCallback(() => {
    saveRate(false)
  }, [])

  return (
    <>
      {id && !isDraft && (
        <Popconfirm
          title={t('global:attention')}
          description={t('newRate:unpublishedAndSavedAsDraft')}
          onConfirm={handleSaveDraft}
        >
          <Button size="large" type="text" className="bold" loading={isLoading}>
            {t('newRate:saveDraft')}
          </Button>
        </Popconfirm>
      )}
      {(!id || isDraft) && (
        <Button
          size="large"
          type="text"
          className="bold"
          onClick={handleSaveDraft}
          loading={isLoading}
        >
          {t('newRate:saveDraft')}
        </Button>
      )}
      <Button
        size="large"
        type="primary"
        className="bold"
        onClick={handleSave}
        loading={isLoading}
      >
        {t('newRate:save')}
      </Button>
    </>
  )
}

export default BtnSaveBox
