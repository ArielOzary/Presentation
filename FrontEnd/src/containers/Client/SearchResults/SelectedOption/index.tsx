import React, { useState } from 'react'

import cn from 'classnames'
import { useNavigate } from 'react-router-dom'

import Header from '../CardsList/Card/Header'
import ChooseSupplier from './ChooseSupplier'
import CreateSupplier from './CreateSupplier'

import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

const SelectedOption: React.FC = () => {
  const navigate = useNavigate()
  const [isOpen, setOpen] = useState<boolean>(true)
  const [createSupplier, setCreateSupplier] = useState<boolean>(false)

  const selectedQuote = useSearchQuoteStore(store => store.selectedQuote)

  if (!Object.keys(selectedQuote).length) {
    navigate('/client/search-quote')
  }

  return (
    <div className="wrapper">
      <div className={styles.wrapper}>
        <Header
          isOpen={isOpen}
          setOpen={setOpen}
          item={selectedQuote}
          selected
        />
        <div className={cn(styles.item, !isOpen && styles.collapsed)}>
          <div className={styles.content}>
            {createSupplier ? (
              <CreateSupplier />
            ) : (
              <ChooseSupplier setCreateSupplier={setCreateSupplier} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectedOption
