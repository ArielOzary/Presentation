import React, { useEffect } from 'react'

import { Navigate } from 'react-router-dom'

import Specifications from '../SearchQuote/Specifications'
import List from './CardsList'
import CustomQuote from './CustomQuote'
import SideBar from './SideBar'

import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

const SearchResults: React.FC = () => {
  const [isSuccess, requestedCustomQuote, setRequestedCustomQuote] =
    useSearchQuoteStore(store => [
      store.isSuccess,
      store.requestedCustomQuote,
      store.setRequestedCustomQuote,
    ])

  useEffect(() => {
    setRequestedCustomQuote(false)
  }, [])

  return isSuccess ? (
    <>
      <Specifications />
      {requestedCustomQuote ? (
        <CustomQuote />
      ) : (
        <div className="wrapper">
          <div className={styles.wrapper}>
            <SideBar />
            <List />
          </div>
        </div>
      )}
    </>
  ) : (
    <Navigate to="/client/search-quote" />
  )
}

export default SearchResults
