import React, { useEffect } from 'react'

import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import ContactUs from './ContactUs'
import Dashboard from './Dashboard'
import Header from './Header'
import HelpCenter from './HelpCenter'
import Profile from './Profile'
import SearchQuote from './SearchQuote'
import SearchResults from './SearchResults'
import SelectedOption from './SearchResults/SelectedOption'

import { useSearchQuoteStore } from 'stores/searchQuote'

const Client: React.FC = () => {
  const { pathname } = useLocation()
  const setDefault = useSearchQuoteStore(store => store.setDefault)

  useEffect(() => {
    if (!pathname.includes('/search-quote')) {
      setDefault()
    }
  }, [pathname])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/dashboard/:tab" element={<Dashboard />} />
        <Route path="/search-quote" element={<SearchQuote />} />
        <Route path="/search-quote/results" element={<SearchResults />} />
        <Route path="/search-quote/results/:id" element={<SelectedOption />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/helpCenter" element={<HelpCenter />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/*"
          element={<Navigate to="/client/dashboard/active" replace />}
        />
      </Routes>
    </>
  )
}

export default Client
