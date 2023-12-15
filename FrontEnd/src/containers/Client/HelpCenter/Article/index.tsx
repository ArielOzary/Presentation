import React from 'react'

import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Anchor, Button } from 'antd'
import { useTranslation } from 'react-i18next'

import { AnchorType } from '../Types'

import styles from './styles.module.scss'

interface Props {
  anchor?: AnchorType[]
  children?: React.ReactNode
  nextPage: () => void
  prevPage: () => void
}
const Article: React.FC<Props> = ({ anchor, children, nextPage, prevPage }) => {
  const { t } = useTranslation(['helpCenter', 'global'])

  return (
    <div className={styles.box}>
      <div className={styles.container}>
        {children}
        <div className={styles.footer}>
          {/* <p>{t('helpCenter:wasThisHelp')}</p>
          <div className={styles.helpQuestion}>
            <Button className={styles.answerButton}>{t('global:yes')}</Button>
            <Button className={styles.answerButton}>{t('global:no')}</Button>
          </div> */}
          <div className={styles.pagination}>
            <Button className={styles.buttonPrev} onClick={prevPage}>
              <LeftOutlined />
              <span className={styles.spanPrev}>
                {t('helpCenter:previous')}
              </span>
            </Button>
            <Button className={styles.buttonNext} onClick={nextPage}>
              <span className={styles.spanNext}>{t('global:next')}</span>
              <RightOutlined />
            </Button>
          </div>
        </div>
      </div>
      {anchor && (
        <div className={styles.anchorBox}>
          <p className={styles.title}>{t('helpCenter:onThisPage')}</p>
          <div className={styles.anchor}>
            <Anchor items={anchor} className={styles.item} affix={false} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Article
