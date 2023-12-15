import React, { useState } from 'react'

import cn from 'classnames'

import ExpandedInfo from './ExpandedInfo'
import Header from './Header'

import { QuoteDto } from 'models'

import styles from './styles.module.scss'

interface Props {
  item: QuoteDto
}

const Card: React.FC<Props> = ({ item }) => {
  const [isOpen, setOpen] = useState<boolean>(false)

  return (
    <div className={styles.wrapper}>
      <Header isOpen={isOpen} setOpen={setOpen} item={item} selected={false} />
      <div className={cn(styles.item, !isOpen && styles.collapsed)}>
        <ExpandedInfo item={item} />
      </div>
    </div>
  )
}

export default Card
