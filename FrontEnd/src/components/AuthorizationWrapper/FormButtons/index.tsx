import React from 'react'

import { Button, Form, Space } from 'antd'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

interface Props {
  onPrev?: () => void
  onNext?: () => void
  nextText: string
  loading?: boolean
  disabled?: boolean
  disabledNext?: boolean
  className?: string
}

const FormButtons: React.FC<Props> = ({
  onPrev,
  onNext,
  nextText,
  loading,
  disabled,
  disabledNext,
  className,
}) => {
  const { t } = useTranslation(['global'])

  return (
    <Form.Item className={className}>
      <Space className={styles.buttons}>
        {onPrev ? (
          <Button
            type="text"
            onClick={onPrev}
            className="bold"
            loading={loading}
            disabled={disabled}
            size="large"
          >
            {t('back')}
          </Button>
        ) : null}
        <Button
          type="primary"
          htmlType={onNext ? 'button' : 'submit'}
          onClick={onNext}
          loading={loading}
          disabled={disabled || disabledNext}
          className="bold"
          size="large"
        >
          {nextText}
        </Button>
      </Space>
    </Form.Item>
  )
}

export default FormButtons
